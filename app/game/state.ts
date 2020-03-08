import { defaults } from "lodash";

/**
 * game state
 */

export default interface GameState {
  id: string;
  status: GameStatus;
  playedCards: Card[];
  drawPile: Card[];
  discardPile: Card[];
  players: Player[];
  tokens: Tokens;
  currentPlayer: number;
  options: GameOptions;
  // this is initiated as the number of players + 1 and serves for
  // the last round of game when the draw is empty
  actionsLeft: number;
  turnsHistory: Turn[];
  history: GameState[];
  createdAt: number;
  synced: boolean;
  // Replay mode
  replayCursor?: number;
  originalGame?: GameState;
}

/**
 * Subtypes of the game state
 */

export interface GameOptions {
  id: string;
  playersCount: number;
  multicolor: boolean;
  allowRollback: boolean;
  preventLoss: boolean;
  seed: string;
  private: boolean;
  hintsLevel: GameHintsLevel;
  turnsHistory: boolean;
  botsWait: number;
  gameMode: GameMode;
}

export enum GameMode {
  NETWORK = "network",
  PASS_AND_PLAY = "pass_and_play"
}

export enum GameHintsLevel {
  // Direct hints & game deductions are displayed (TBD)
  ALL = "all",
  // Direct hints are displayed
  DIRECT = "direct",
  // No hints displayd
  NONE = "none"
}

export enum GameStatus {
  LOBBY = "lobby",
  ONGOING = "ongoing",
  OVER = "over"
}

export enum Color {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
  WHITE = "white",
  YELLOW = "yellow",
  MULTICOLOR = "multicolor"
}

export type Number = 1 | 2 | 3 | 4 | 5;

export enum HintLevel {
  IMPOSSIBLE = 0,
  POSSIBLE = 1,
  SURE = 2
}

// an array of 2 (direct hint), 1 (still possible), or 0 (impossible)
// e.g. a color hint onto an card turns all but one values to 0, and one value to 2.
// a color hint onto a card give all the other cards in the hand a 0 for that color.
// it's something public, i.e. information that has been given
// to all players
export interface CardHint {
  color: { [key in Color]: HintLevel };
  number: { [key in 0 | 1 | 2 | 3 | 4 | 5]: HintLevel };
}

export type Hand = Card[];

export interface Card {
  color: Color;
  number: Number;
  hint?: CardHint;
  id?: number;
}

export type ActionType = "discard" | "play" | "hint";

export interface DiscardAction {
  action: "discard";
  from: number;
  card?: Card;
  cardIndex: number;
}

export interface PlayAction {
  action: "play";
  from: number;
  card?: Card;
  cardIndex: number;
}

export type HintType = "color" | "number";

export interface HintAction {
  action: "hint";
  from: number;
  to: number;
  type: HintType;
  value: Color | Number;
}

export type Action = DiscardAction | PlayAction | HintAction;

export interface Turn {
  action: Action;
  card?: Card;
}

export interface Player {
  id: string;
  name: string;
  hand?: Hand;
  reaction?: string;
  lastAction?: Action;
  index?: number;
  notified?: boolean;
  bot: boolean;
}

// the *remaining* strikes and hints.
// There are 8 hints and 3 strikes to begin with.
export interface Tokens {
  hints: number;
  strikes: number;
}

// empty arrays are returned as null in Firebase, so we fill
// them back to avoid having to type check everywhere
export function fillEmptyValues(state: GameState): GameState {
  return defaults(state, {
    playedCards: [],
    drawPile: [],
    discardPile: [],
    players: (state.players || []).map(player =>
      defaults(player, {
        hand: []
      })
    ),
    turnsHistory: [],
    history: [],
    reactions: []
  });
}
