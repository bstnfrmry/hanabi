import { cloneDeep, filter, findLastIndex } from "lodash";

import {
  colors,
  commitAction,
  getPlayedCardsPile,
  isPlayable,
  numbers
} from "./actions";
import IGameState, {
  IAction,
  ICard,
  ICardHint,
  IHintAction,
  INumber,
  IPlayer
} from "./state";

export enum IDeductionStatus {
  PLAYABLE = 0, // the card value is such that it can be played right now
  HAPPYDISCARD, // the card can never be useful, free money
  DISCARD, // the card can be discarded, there's another one like this in the draw pile
  SADDISCARD // if discarded, the card leads to a lost point (incomplete pile)
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

/**
 * Check whether the current card can be in hand
 */
function isCardPossible(card: ICard, possibleCards: ICard[]): boolean {
  return (
    possibleCards.findIndex(
      c => c.number === card.number && c.color === card.color
    ) > -1
  );
}

function isCardDangerous(card: ICard, state: IGameState): boolean {
  if (!isCardEverPlayable(card, state)) {
    return false;
  }
  if (card.color === "multicolor" || card.number === 5) {
    return true;
  }
  if (
    state.discardPile.find(
      c => c.color === card.color && c.number === card.number
    )
  ) {
    return true;
  }

  return false;
}

function isCardEverPlayable(card: ICard, state: IGameState): boolean {
  const playedCardsPile = getPlayedCardsPile(state);
  // if the card has already been played once
  if (playedCardsPile[card.color] >= card.number) {
    return false;
  } else if (playedCardsPile[card.color] < card.number - 1) {
    // let's check whether the cards in between have been discarded
    // e.g. the game pile is a 3 Red, the 2 4s in the discard, and I have a 5 Red
    for (let i = playedCardsPile[card.color] + 1; i < card.number; i++) {
      const discarded = filter(
        state.discardPile,
        e => e.color === card.color && e.number === i
      );
      const cardCount = card.color === "multicolor" ? 1 : 2;
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
function isCardDiscardable(card: IHiddenCard, state: IGameState): boolean {
  // AI can discard a card that can never be played (already played or because of discards)
  if (
    card.deductions.every(deduction => !isCardEverPlayable(deduction, state))
  ) {
    return true;
  }

  // don't discard necessarily dangerous cards
  if (card.deductions.every(deduction => isCardDangerous(deduction, state))) {
    return false;
  }

  return true;
}

export function getHintDeductions(
  hint: ICardHint,
  possibleCards: ICard[]
): IDeduction[] {
  const deductions: IDeduction[] = [];
  colors.forEach(color => {
    numbers.forEach(number => {
      if (
        hint.color[color] > 0 &&
        hint.number[number] > 0 &&
        isCardPossible({ color, number } as ICard, possibleCards)
      ) {
        deductions.push({
          number: number as INumber,
          color,
          deductionLevel: 0
        } as IDeduction);
      }
    });
  });
  return deductions;
}

function getPossibleCards(state: IGameState, player: number): ICard[] {
  return [...state.drawPile, ...Object.values(state.players)[player].hand].map(
    c => ({
      color: c.color,
      number: c.number
    })
  );
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

export function getLastOptimistCardOfCurrentPlayer(
  state: IGameState
): ICard | null {
  const lastTimeHinted = findLastIndex(
    state.turnsHistory,
    g => g.action.action === "hint" && g.action.to === state.currentPlayer
  );

  if (lastTimeHinted === -1) {
    return null;
  }

  const lastHintReceived = state.turnsHistory[lastTimeHinted]
    .action as IHintAction;

  const gameWhenLastHinted =
    state.history[lastTimeHinted].players[state.currentPlayer].hand;

  const firstHintedCard = gameWhenLastHinted.find(
    card => card[lastHintReceived.type] === lastHintReceived.value
  );

  return firstHintedCard || null;
}

export function gameStateToGameView(gameState: IGameState): IGameView {
  // copy the state
  const state = cloneDeep(gameState) as IGameView;
  state.gameViews = [];

  const lastOptimistCard = getLastOptimistCardOfCurrentPlayer(state);

  // add a parallel array to the players that give their view of the game
  // and make all level 0 deductions
  Object.values(state.players).forEach((player: IPlayer, i) => {
    const gameView = { hand: [] };
    const possibleCards = getPossibleCards(state, i);
    player.hand.forEach((card: ICard) => {
      gameView.hand.push({
        hint: card.hint,
        deductions: getHintDeductions(card.hint, possibleCards),
        optimist: lastOptimistCard && card.id === lastOptimistCard.id
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

function findGivableHint(
  hand: ICard[],
  pIndex: number,
  state: IGameState
): IAction | undefined {
  // find the first playable card and give a hint on it.
  // if possible, give an optimist hint.
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    if (
      isPlayable(card, state.playedCards) &&
      (card.hint.color[card.color] < 2 || card.hint.number[card.number] < 2)
    ) {
      // find the type of hint to give, trying to find the most optimist one
      // (if there's a card with the same color, give the number hint)
      let type;
      if (hand.slice(0, i).find(c => c.color === card.color)) {
        type = card.hint.number[card.number] < 2 ? "number" : "color";
      } else {
        type = card.hint.color[card.color] < 2 ? "color" : "number";
      }
      return {
        action: "hint",
        from: state.currentPlayer,
        to: pIndex,
        type,
        value: card[type]
      };
    }
  }

  // give a hint on the last card to avoid discard if possible
  const lastCard = hand[hand.length - 1];
  if (
    isCardDangerous(lastCard, state) &&
    (lastCard.hint.color[lastCard.color] < 2 ||
      lastCard.hint.number[lastCard.number] < 2)
  ) {
    const type = lastCard.hint.number[lastCard.number] < 2 ? "number" : "color";
    return {
      action: "hint",
      from: state.currentPlayer,
      to: pIndex,
      type,
      value: lastCard[type]
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
    if (
      card.deductions.every(deduction =>
        isPlayable(deduction, state.playedCards)
      )
    ) {
      return {
        action: "play",
        from: state.currentPlayer,
        cardIndex: i
      };
    }
  }

  if (state.tokens.strikes < 2) {
    // find the most recent optimist card that may be playable and play it
    const optimistCardIndex = currentGameView.hand.findIndex(c => c.optimist);
    if (
      optimistCardIndex > -1 &&
      currentGameView.hand[optimistCardIndex].deductions.some(c =>
        isPlayable(c, state.playedCards)
      )
    ) {
      return {
        action: "play",
        from: state.currentPlayer,
        cardIndex: optimistCardIndex
      };
    }
  }

  if (state.tokens.hints > 0) {
    // if someone has a playable card (but with some hint uncertainty), give hint
    for (let i = 1; i < state.options.playersCount; i++) {
      const pIndex = (state.currentPlayer + i) % state.options.playersCount;
      const player = Object.values(state.players)[pIndex];

      const action = findGivableHint(player.hand, pIndex, state);
      if (action) {
        return action;
      }
    }
  }

  // discard otherwise
  if (state.tokens.hints < 8) {
    for (let i = currentGameView.hand.length - 1; i >= 0; i--) {
      const card = currentGameView.hand[i];
      if (isCardDiscardable(card, state)) {
        return {
          action: "discard",
          from: state.currentPlayer,
          cardIndex: i
        };
      }
    }
  } else {
    return {
      action: "play",
      from: state.currentPlayer,
      cardIndex: 0
    };
  }
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

export default function play(state: IGameState): IGameState {
  // play an AI action as the current player
  // @todo this gameview should be persisted from action to action,
  // we commit
  const gameView = gameStateToGameView(state);
  const action = chooseAction(gameView);
  return commitAction(state, action);
}
