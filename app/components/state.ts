export interface IGameState {
  playedCards: ICard[];
  drawPile: ICard[];
  discardPile: ICard[];
  players: IPlayer[];
  tokens: ITokens;
  lastAction?: IAction;
  currentPlayer: number;
  options: IGameOptions;
}

export interface IGameOptions {
  playersCount: number;
  multicolor: boolean;
}

export enum IColor {
  RED = 1,
  GREEN,
  BLUE,
  WHITE,
  YELLOW,
  MULTICOLOR
}

// an array of true (still possible) or false (impossible)
// e.g. a hint onto an unknown card turns all but one values to false
// it's something public, i.e. information that has been given
// to all players
export interface ICardHint {
  color: boolean[];
  number: boolean[];
}

export type IHand = IHandCard[];

export interface ICard {
  color: IColor;
  number: number;
}

export interface IHandCard extends ICard {
  hint: ICardHint;
}

export interface IAction {
  from: number;
  to: number;
  type: "color" | "number";
  value: IColor | number;
}

export interface IPlayer {
  hand: IHand;
  name: string;
  id: number;
  lastAction?: IAction;
}

export interface ITokens {
  hints: number;
  strikes: number;
}

export type gameHistory = IGameState[];
