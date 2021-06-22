import { cloneDeep, filter, findLastIndex } from "lodash";
import { commitAction, getColors, getHintableColors, getPlayedCardsPile, getStateAtTurn, isPlayable, matchColor, numbers } from "./actions";
import IGameState, { IAction, ICard, ICardHint, IHintAction, IHintLevel, INumber, IColor, IPlayer, GameVariant } from "./state";

export enum IDeductionStatus {
  PLAYABLE = 0, // the card value is such that it can be played right now
  HAPPYDISCARD, // the card can never be useful, free money
  DISCARD, // the card can be discarded, there's another one like this in the draw pile
  SADDISCARD, // if discarded, the card leads to a lost point (incomplete pile)
}

export interface IPlayerView {
  hand: IHiddenCard[];
}

/**
 * A hidden card has an array of deductions, i.e. possible values with deduction levels
 *
 * A hidden card is said to be "optimist" when it's (one of) the last card(s) that was designated for a hint
 * since the player last played.
 * When there are several possible deductions for a card, we always assume that playing it/ discarding it
 * leads to the worst possible outcome, unless it's an optimist card in which case we trust our partners :)
 */
export interface IHiddenCard {
  hint: ICardHint;
  deductions: IDeduction[];
  optimist: boolean;
}

export function isCriticalCard(card: ICard, state: IGameState): boolean {
  return (card.color === IColor.RAINBOW && state.options.variant === GameVariant.CRITICAL_RAINBOW)
    || card.color === IColor.MULTICOLOR;
}

function identicalCardCount(card: ICard, state: IGameState): number {
  if (isCriticalCard(card, state)) {
    return 1;
  }
  return { 1: 3, 2: 2, 3: 2, 4: 2, 5: 1 }[card.number];
}

/**
 * Check whether the current card can be in hand
 */
function isCardPossible(card: ICard, possibleCards: ICard[]): boolean {
  return possibleCards.findIndex((c) => c.number === card.number && c.color === card.color) > -1;
}

export function isCardDangerous(card: ICard, state: IGameState): boolean {
  if (!isCardEverPlayable(card, state)) {
    return false;
  }
  if (identicalCardCount(card, state) === 1) {
    return true;
  }

  const discarded = state.discardPile.filter(c => c.color === card.color && c.number === card.number);
  if (discarded.length === identicalCardCount(card, state) - 1) {
      return true;
  }

  return false;
}

export function isCardEverPlayable(card: ICard, state: IGameState): boolean {
  const playedCardsPile = getPlayedCardsPile(state);
  // if the card has already been played once
  if (playedCardsPile[card.color] >= card.number) {
    return false;
  } else if (playedCardsPile[card.color] < card.number - 1) {
    // let's check whether the cards in between have been discarded
    // e.g. the game pile is a 3 Red, the 2 4s in the discard, and I have a 5 Red
    for (let i = playedCardsPile[card.color] + 1; i < card.number; i++) {
      const discarded = filter(state.discardPile, (e) => e.color === card.color && e.number === i);
      const cardCount = identicalCardCount({color: card.color, number: i as INumber} as ICard, state);
      if (discarded.length === cardCount) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check whether the current card can be discarded
 */
export function isCardDiscardable(card: IHiddenCard, state: IGameState): boolean {
  // AI can discard a card that can never be played (already played or because of discards)
  if (card.deductions.every((deduction) => !isCardEverPlayable(deduction, state))) {
    return true;
  }
  // Taking a probabilistic approach for possibly dangerous cards
  if (1.0 * card.deductions.filter((deduction) => isCardDangerous(deduction, state)).length / card.deductions.length >= 0.45) {
    return false;
  }
  return true;
}

export function getHintDeductions(hint: ICardHint, possibleCards: ICard[], game: IGameState): IDeduction[] {
  const deductions: IDeduction[] = [];
  const colors = getColors(game.options.variant);

  colors.forEach((color) => {
    numbers.forEach((number) => {
      if (
        hint.color[color] > 0 &&
        hint.number[number] > 0 &&
        isCardPossible({ color, number } as ICard, possibleCards)
      ) {
        deductions.push({
          number: number as INumber,
          color,
          deductionLevel: 0,
        } as IDeduction);
      }
    });
  });
  return deductions;
}

function getPossibleCards(state: IGameState, player: number): ICard[] {
  return [...state.drawPile, ...Object.values(state.players)[player].hand].map((c) => ({
    color: c.color,
    number: c.number,
  }));
}

/**
 * A deduction is a possible value for a card, inferred from different deduction levels.
 * Level 0: all possible values (color, number) given the card's hints are of level 0 (or more)
 * Level 1: all possible values given the card's hints and all observable cards (other players games, discard pile) are of level 1 (or more)
 * Level 2: all level 1 values that are compatible with the previous player's action being optimal
 * Level 3: all level 2 values that are compatible with the the two previous actions being optimal
 * ...
 * A higher level deduction is less certain (although 0 and 1 are certain and deterministic)
 * but makes the card more likely to be played.
 *
 * Before playing, each deduction will be assigned a status (IDeductionStatus)
 * (playing a 5) > (playing a playable card) > (happy discard) > (giving a hint) > (discard) > (sad discard)
 *
 */
export interface IDeduction extends ICard {
  deductionLevel: number;
}

export type IGameView = IGameState & { gameViews: IPlayerView[] };

export function getLastOptimistCardOfPlayer(state: IGameState, player: number): ICard | null {
  const lastTimeHinted = findLastIndex(state.turnsHistory, (g) => g.action.action === "hint" && g.action.to === player);

  const lastTimePlayed = findLastIndex(
    state.turnsHistory,
    (g) => g.action.action === "play" && g.action.from === player
  );

  if (lastTimeHinted === -1 || lastTimePlayed > lastTimeHinted) {
    return null;
  }

  const lastHintReceived = state.turnsHistory[lastTimeHinted].action as IHintAction;

  const gameWhenLastHinted = getStateAtTurn(state, lastTimeHinted).players[player].hand;

  const firstHintedCard = gameWhenLastHinted.find((card) => card[lastHintReceived.type] === lastHintReceived.value);

  return firstHintedCard || null;
}

export function gameStateToGameView(gameState: IGameState): IGameView {
  // copy the state
  const state = cloneDeep(gameState) as IGameView;
  state.gameViews = [];

  // add a parallel array to the players that give their view of the game
  // and make all level 0 deductions
  Object.values(state.players).forEach((player: IPlayer, i) => {
    const lastOptimistCard = getLastOptimistCardOfPlayer(state, i);
    const gameView = { hand: [] };
    const possibleCards = getPossibleCards(state, i);
    player.hand.forEach((card: ICard) => {
      gameView.hand.push({
        hint: card.hint,
        deductions: getHintDeductions(card.hint, possibleCards, state),
        optimist: lastOptimistCard && card.id === lastOptimistCard.id,
      } as IHiddenCard);
    });
    state.gameViews.push(gameView);
  });

  return state;
}

export function commitViewAction(state: IGameView, action: IAction): IGameView {
  // change how players change their views given a certain action
  const newState = commitAction(state, action) as IGameView;
  newState.gameViews = state.gameViews;
  if (action.action === "hint") {
    // @todo change the player view of the person who received a hint
  } else {
    // @todo check what card was just drawn and apply new knowledge to other players
  }

  return newState;
}

function findRainbowAssuringColorHint(card: ICard, hand: ICard[], state: IGameState): IColor {
  const rainbowAssuringColors = getHintableColors(state).filter((color) => card.hint.color[color] !== IHintLevel.CANDIDATE);
  // find the color that won't touch unnecessarily any other card if it is possible
  const preferredHints = rainbowAssuringColors.filter((color) => hand.every((card) => card.color !== color));
  return preferredHints.length ? preferredHints[0] : rainbowAssuringColors[0];
}

function findGivableHint(hand: ICard[], pIndex: number, state: IGameState): IAction | undefined {
  // find the first playable card and give a hint on it.
  // if possible, give an optimist hint.

  // while we have not reached the second hinted card
  const isRainbowVariant = state.options.variant === GameVariant.RAINBOW || state.options.variant === GameVariant.CRITICAL_RAINBOW;
  let isFirstHintedCardOrBefore = true;
  let hasPlayableCard = false;
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];

    if (isPlayable(card, state.playedCards) &&
        !hand.slice(i + 1, hand.length).find((c) => c.color === card.color && c.number === card.number)) {
      hasPlayableCard = true;
      // we don't hint the first hinted card.
      const shouldHint = isFirstHintedCardOrBefore
        ? card.hint.color[card.color] < IHintLevel.SURE && card.hint.number[card.number] < IHintLevel.SURE
        : card.hint.color[card.color] < IHintLevel.SURE || card.hint.number[card.number] < IHintLevel.SURE;

      if (shouldHint) {
        // find the type of hint to give, trying to find the most optimist one
        // (if there's a card with the same color, give the number hint)
        let type;
        if (hand.slice(0, i).find((c) => c.color === card.color && card.color !== IColor.RAINBOW)) {
          type = card.hint.number[card.number] < IHintLevel.SURE ? "number" : "color";
        } else {
          type = card.hint.color[card.color] < IHintLevel.CANDIDATE ? "color" : "number";
        }
        let value = card[type];
        if (isRainbowVariant && value === IColor.RAINBOW) {
          value = findRainbowAssuringColorHint(card, hand, state);
        }
        return {
          action: "hint",
          from: state.currentPlayer,
          to: pIndex,
          type,
          value,
        };
      }
    }

    // if the card has hints, we switch the condition
    if (card.hint.color[card.color] < IHintLevel.SURE || card.hint.number[card.number] < IHintLevel.SURE) {
      isFirstHintedCardOrBefore = false;
    }
  }

  // give a hint on the last card to avoid discard if possible
  const lastCard = hand[hand.length - 1];
  if (
    isCardDangerous(lastCard, state) &&
    (lastCard.hint.color[lastCard.color] === IHintLevel.SURE && lastCard.hint.number[lastCard.number] < IHintLevel.CANDIDATE ||
    lastCard.hint.color[lastCard.color] < IHintLevel.SURE && lastCard.hint.number[lastCard.number] < IHintLevel.SURE) &&
    !hasPlayableCard
  ) {
    const type =
      // if it's a 5 and the number hint is not given
      lastCard.number === 5 && lastCard.hint.number[lastCard.number] < IHintLevel.SURE
        ? "number"
        : // if it's a multicolor and the color hint is not given
        lastCard.color === IColor.MULTICOLOR && lastCard.hint.color[lastCard.color] < IHintLevel.SURE
        ? "color"
        : // if it's a critical rainbow and color hint can assure that it is rainbow
        isCriticalCard(lastCard, state) && lastCard.hint.color[lastCard.color] === IHintLevel.CANDIDATE
        ? "color"
        : // otherwise give a non given hint
        lastCard.hint.number[lastCard.number] < IHintLevel.SURE
        ? "number"
        : "color";
    let value = lastCard[type];
    if (isRainbowVariant && value === IColor.RAINBOW) {
      value = findRainbowAssuringColorHint(lastCard, hand, state);
    }
    return {
      action: "hint",
      from: state.currentPlayer,
      to: pIndex,
      type,
      value,
    };
  }

  // @todo smarter handling of dangerous cards : give the last card that's dangerous
  // that's not known to be dangerous
}

export function chooseAction(state: IGameView): IAction {
  // this function finds the most suitable action given the current player's playerView (what they know about the game)
  // first only implement the case where we play the best card with level 1 deductions
  // then when it works make the function:
  // - look behind and make higher level deductions depending on the assumption of optimality of the partners
  // (assuming those partners use the same lookAhead and lookBehind - 1)
  // note that those deductions should be kept in memory until challenged, so that the deduction knowledge carries on over rounds
  // - look ahead to play what triggers the best score
  // (heuristic = maxPossibleScore + 1.5 * numbers of 5s played + 1 * number of other cards played + 0.5 * happy discards - 1.5 discards - 2 sad discards) ?
  // assuming those partners use the same lookBehind and lookAhead - 1

  // if current player has a playable card, play
  const currentGameView = state.gameViews[state.currentPlayer];
  // try to find a definitely playable card
  for (let i = 0; i < currentGameView.hand.length; i++) {
    const card = currentGameView.hand[i];
    if (card.deductions.every((deduction) => isPlayable(deduction, state.playedCards))) {
      return {
        action: "play",
        from: state.currentPlayer,
        cardIndex: i,
      };
    }
  }

  if (state.tokens.strikes < 2) {
    // find the most recent optimist card that may be playable and play it
    const optimistCardIndex = currentGameView.hand.findIndex((c) => c.optimist);
    if (
      optimistCardIndex > -1 &&
      currentGameView.hand[optimistCardIndex].deductions.some((c) => isPlayable(c, state.playedCards)) &&
      !isLastDiscardableCard(currentGameView.hand, optimistCardIndex, state)
    ) {
      return {
        action: "play",
        from: state.currentPlayer,
        cardIndex: optimistCardIndex,
      };
    }
  }

  if (state.tokens.hints > 0) {
    // if someone has a playable card (but with some hint uncertainty), give hint
    for (let i = 1; i < state.options.playersCount; i++) {
      const pIndex = (state.currentPlayer + i) % state.options.playersCount;
      const player = Object.values(state.players)[pIndex];
      if (!playerKnowsWhatToPlay(pIndex, state)) {
        const action = findGivableHint(player.hand, pIndex, state);
        if (action) {
          return action;
        }
      }
    }
  }

  // discard otherwise
  if (state.tokens.hints < 8) {
    const discardableIndex = findBestDiscardIndex(currentGameView, state);

    if (discardableIndex > -1) {
      return {
        action: "discard",
        from: state.currentPlayer,
        cardIndex: discardableIndex,
      };
    }
  }

  // if 1st play and no playable cards in next player hand, give a hint on 5s or 2s
  if (state.turnsHistory.length === 0) {
    const pIndex = (state.currentPlayer + 1) % state.options.playersCount;
    const nextPlayerHand = state.players[pIndex].hand;
    if (nextPlayerHand.find((c) => c.number === 5)) {
      return {
        action: "hint",
        from: state.currentPlayer,
        to: pIndex,
        type: "number",
        value: 5,
      };
    }
    // if next player has no 5, give a hint on 2s (positive or negative)
    else {
      return {
        action: "hint",
        from: state.currentPlayer,
        to: pIndex,
        type: "number",
        value: 2,
      };
    }
  }

  return {
    action: "play",
    from: state.currentPlayer,
    cardIndex: 0,
  };
}

function isLastDiscardableCard(hand: IHiddenCard[], cardIndex: number, state: IGameState) {
  let lastDiscardableCard = true;
  for (let i = hand.length - 1; i >= cardIndex + 1; i--) {
    if (isCardDiscardable(hand[i], state)) {
      lastDiscardableCard = false;
      return lastDiscardableCard;
    }
  }

  return lastDiscardableCard;
}

/**
 * Find the index of the right most unclued card
 */
function findBestDiscardIndex(playerView: IPlayerView, state: IGameState) {
  let uncluedDiscardableCard = false;
  let discardableIndex = -1;

  for (let i = playerView.hand.length - 1; i >= 0; i--) {
    const card = playerView.hand[i];
    // if the card is definitely discardable (never playable)
    if (card.deductions.every((deduction) => !isCardEverPlayable(deduction, state))) {
      discardableIndex = i;
      break;
    }

    // if the card is unclued and not dangerous
    if (
      isCardDiscardable(card, state) &&
      !Object.values(card.hint.color).find((v) => v >= IHintLevel.CANDIDATE) &&
      !Object.values(card.hint.number).find((v) => v >= IHintLevel.CANDIDATE) &&
      !uncluedDiscardableCard
    ) {
      uncluedDiscardableCard = true;
      discardableIndex = i;
    }

    // if it's the first discardable card we find, regardless of being already clued
    if (isCardDiscardable(card, state) && discardableIndex === -1) {
      discardableIndex = i;
    }
  }

  return discardableIndex;
}

/**
 * we inspect how the previous person would have played for each possible combination of deductions (i.e possible games)
 * and keep a set of deductions that correspond to what that person actually played.
 */

/**
 * Likewise, looking in the future, we check what the optimal move of the next person would be (in her view)
 * for each of our possible sets of deductions, and play the one that lead to the best outcome after that player
 * has made her action.
 */

/** that recursion is bounded by a max lookahead forwards and backwards. We should check the compute load but it should be alright?
 */

export function play(state: IGameState): IGameState {
  // play an AI action as the current player
  // @todo this gameview should be persisted from action to action,
  // we commit
  const gameView = gameStateToGameView(state);
  const action = chooseAction(gameView);
  return commitAction(state, action);
}

function playerKnowsWhatToPlay(pIndex: number, state: IGameView) {
  // we should not be looking at that player's game view but
  // if we only look at the optimist property that's ok
  const playerGameViewHand = state.gameViews[pIndex].hand;
  const playerHand = Object.values(state.players)[pIndex].hand;
  const hasOptimistPlayableCard =
    playerGameViewHand.filter((c, i) => c.optimist && isPlayable(playerHand[i], state.playedCards)).length > 0;

  return hasOptimistPlayableCard;
}
