import IGameState, {
  ICardHint,
  INumber,
  IColor,
  ICard,
  IAction,
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
  deductions: IDeduction[];
  optimist: boolean;
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
  // add a parallel array to the players that give their view of the game
  // make all level 0 deductions
  // return the modified state as IGameView
  throw new Error("notimplemented");
}

export function makeLevel1Deductions(gameView: IGameView): IGameView {
  // this function can mutate the gameview
  // make sure we assert that we're never reading from the current player's cards
  throw new Error("notimplemented");
}

export function choseAction(
  gameView: IGameView,
  lookAhead: number = 0,
  lookBehind: number = 0
): IAction {
  // this function finds the most suitable action given the current player's playerView (what they know about the game)
  // first only implement the case where we play the best card with level 1 deductions
  // then when it works make the function:
  // - look behind and make higher level deductions depending on the assumption of optimality of the partners
  // (assuming those partners use the same lookAhead and lookBehind - 1)
  // note that those deductions should be kept in memory until challenged, so that the deduction knowledge carries on over rounds
  // - look ahead to play what triggers the best score
  // (heuristic = maxPossibleScore + 1.5 * numbers of 5s played + 1 * number of other cards played + 0.5 * happy discards - 1.5 discards - 2 sad discards) ?
  // assuming those partners use the same lookBehind and lookAhead - 1
  throw new Error("notimplemented");
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
