import { defaults } from "lodash";

/**
 * game state
 */

export default interface IGameState {
  id: string;
  status: IGameStatus;
  playedCards: ICard[];
  drawPile: ICard[];
  discardPile: ICard[];
  players: IPlayer[];
  tokens: ITokens;
  currentPlayer: number;
  options: IGameOptions;
  // this is initiated as the number of players + 1 and serves for
  // the last round of game when the draw is empty
  actionsLeft: number;
  turnsHistory: ITurn[];
  history: IGameState[];
  createdAt: number;
  synced: boolean;
}

/**
 * Subtypes of the game state
 */

export interface IGameOptions {
  id: string;
  playersCount: number;
  multicolor: boolean;
  allowRollback: boolean;
  preventLoss: boolean;
  seed: string;
  private: boolean;
  hintsLevel: IGameHintsLevel;
  turnsHistory: boolean;
  botsWait: number;
}

export enum IGameHintsLevel {
  // Direct hints & game deductions are displayed (TBD)
  ALL = "all",
  // Direct hints are displayed
  DIRECT = "direct",
  // No hints displayd
  NONE = "none"
}

export enum IGameStatus {
  LOBBY = "lobby",
  ONGOING = "ongoing",
  OVER = "over"
}

export enum IColor {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
  WHITE = "white",
  YELLOW = "yellow",
  MULTICOLOR = "multicolor"
}

export type INumber = 1 | 2 | 3 | 4 | 5;

export type IHintLevel = 0 | 1 | 2;

// an array of 2 (direct hint), 1 (still possible), or 0 (impossible)
// e.g. a color hint onto an card turns all but one values to 0, and one value to 2.
// a color hint onto a card give all the other cards in the hand a 0 for that color.
// it's something public, i.e. information that has been given
// to all players
export interface ICardHint {
  color: { [key in IColor]: IHintLevel };
  number: { [key in 0 | 1 | 2 | 3 | 4 | 5]: IHintLevel };
}

export type IHand = ICard[];

export interface ICard {
  color: IColor;
  number: INumber;
  hint?: ICardHint;
  id?: number;
}

export type IActionType = "discard" | "play" | "hint";

export interface IDiscardAction {
  action: "discard";
  from: number;
  card?: ICard;
  cardIndex: number;
}

export interface IPlayAction {
  action: "play";
  from: number;
  card?: ICard;
  cardIndex: number;
}

export type IHintType = "color" | "number";

export interface IHintAction {
  action: "hint";
  from: number;
  to: number;
  type: IHintType;
  value: IColor | INumber;
}

export type IAction = IDiscardAction | IPlayAction | IHintAction;

export interface ITurn {
  action: IAction;
  card?: ICard;
}

export interface IPlayer {
  id: string;
  name: string;
  emoji: string;
  hand?: IHand;
  reaction?: string;
  lastAction?: IAction;
  index?: number;
  notified?: boolean;
  bot: boolean;
}

// the *remaining* strikes and hints.
// There are 8 hints and 3 strikes to begin with.
export interface ITokens {
  hints: number;
  strikes: number;
}

// empty arrays are returned as null in Firebase, so we fill
// them back to avoid having to type check everywhere
export function fillEmptyValues(state: IGameState): IGameState {
  return defaults(state, {
    playedCards: [],
    drawPile: [],
    discardPile: [],
    players: [],
    turnsHistory: [],
    history: [],
    reactions: []
  });
}
