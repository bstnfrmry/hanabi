import { cloneDeep } from "lodash";

import { colors, commitAction, isPlayable, numbers } from "~/game/actions";
import IGameState, {
  IAction,
  ICard,
  ICardHint,
  INumber,
  IPlayer
} from "~/game/state";

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
/**
 * Check whether the current card can be discarded
 */

function isDiscardable(card: IHiddenCard): boolean {
  // don't discard multicolor or 5
  if (
    card.hint &&
    (card.hint.color["multicolor"] === 2 || card.hint.number[5] === 2)
  ) {
    return false;
  }

  // TODO sthg better
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

export function gameStateToGameView(gameState: IGameState): IGameView {
  // copy the state
  const state = cloneDeep(gameState) as IGameView;
  state.gameViews = [];

  // add a parallel array to the players that give their view of the game
  // and make all level 0 deductions
  Object.values(state.players).forEach((player: IPlayer, i) => {
    const gameView = { hand: [] };
    const possibleCards = getPossibleCards(state, i);
    player.hand.forEach((card: ICard) => {
      gameView.hand.push({
        hint: card.hint,
        deductions: getHintDeductions(card.hint, possibleCards),
        optimist: false
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

  /**
   * DUMB VERSION
   */

  // if current player has a playable card, play
  const currentGameView = state.gameViews[state.currentPlayer];
  // go from the most recent
  for (let i = 0; i < currentGameView.hand.length; i++) {
    const card = currentGameView.hand[i];
    if (
      // @ todo here check for optimist card to play, in which case even if there's more
      // than 1 deduction if there's a valid one we play it
      card.deductions.length === 1 &&
      isPlayable(card.deductions[0], state.playedCards)
    ) {
      return {
        action: "play",
        from: state.currentPlayer,
        cardIndex: i
      };
    }
  }

  if (state.tokens.hints > 0) {
    // if someone has a playable card (but with some hint uncertainty), give hint
    for (let i = 1; i < state.options.playersCount; i++) {
      const pIndex = (state.currentPlayer + i) % state.options.playersCount;
      const player = Object.values(state.players)[pIndex];

      for (const card of player.hand) {
        if (
          isPlayable(card, state.playedCards) &&
          (card.hint.color[card.color] < 2 || card.hint.number[card.number] < 2)
        ) {
          const type = card.hint.color[card.color] < 2 ? "color" : "number";
          return {
            action: "hint",
            from: state.currentPlayer,
            to: pIndex,
            type: card.hint.color[card.color] < 2 ? "color" : "number",
            value: card[type]
          };
        }
      }
    }
  }

  // discard otherwise
  if (state.tokens.hints < 8) {
    for (let i = currentGameView.hand.length - 1; i >= 0; i--) {
      const card = currentGameView.hand[i];
      if (
        // @ todo here check for better card to discard
        isDiscardable(card)
      ) {
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
