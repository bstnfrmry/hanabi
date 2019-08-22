/**
 * game state
 */

export default interface IGameState {
  status: IGameStatus;
  playersCount: number;
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
}

/**
 * Subtypes of the game state
 */

export interface IGameOptions {
  playersCount: number;
  multicolor: boolean;
  allowRollback: boolean;
  preventLoss: boolean;
  seed: number;
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

// an array of 2 (direct hint), 1 (still possible), or 0 (impossible)
// e.g. a color hint onto an card turns all but one values to 0, and one value to 2.
// a color hint onto a card give all the other cards in the hand a 0 for that color.
// it's something public, i.e. information that has been given
// to all players
export interface ICardHint {
  color: { [key in IColor]: (0 | 1 | 2) };
  number: { [key in 0 | 1 | 2 | 3 | 4 | 5]: (0 | 1 | 2) };
}

export type IHand = ICard[];

export interface ICard {
  color: IColor;
  number: number;
  hint?: ICardHint;
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

export interface IHintAction {
  action: "hint";
  from: number;
  to: number;
  type: "color" | "number";
  value: IColor | INumber;
}

export type IAction = IDiscardAction | IPlayAction | IHintAction;

export interface ITurn {
  action: IAction;
  card?: ICard;
}

export interface IPlayer {
  id: string;
  hand: IHand;
  name: string;
  lastAction?: IAction;
  index?: number;
}

// the *remaining* strikes and hints.
// There are 8 hints and 3 strikes to begin with.
export interface ITokens {
  hints: number;
  strikes: number;
}

// empty arrays are returned as null in Firebase, so we fill
// them back to avoid having to type check everywhere
export function fillEmptyValues(val: IGameState): IGameState {
  if (!val.playedCards) val.playedCards = [];
  if (!val.drawPile) val.drawPile = [];
  if (!val.discardPile) val.discardPile = [];
  if (!val.players) val.players = [];
  if (!val.turnsHistory) val.turnsHistory = [];
  if (!val.history) val.history = [];
  return val;
}
