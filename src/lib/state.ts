import { defaults, omit } from "lodash";

import { commitAction, joinGame, newGame } from "~/lib/actions";
import { ID } from "~/lib/id";

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
  messages: IMessage[];
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  synced: boolean;
  // Replay mode
  originalGame?: IGameState;
  nextGameId?: string;
}

/**
 * Subtypes of the game state
 */

export interface IGameOptions {
  id: string;
  variant?: GameVariant;
  playersCount: number;
  allowRollback: boolean;
  preventLoss: boolean;
  seed: string;
  private: boolean;
  hintsLevel: IGameHintsLevel;
  turnsHistory: boolean;
  botsWait: number;
  gameMode: GameMode;
  colorBlindMode: boolean;
}

export enum GameVariant {
  CLASSIC = "classic",
  MULTICOLOR = "multicolor",
  RAINBOW = "rainbow",
  ORANGE = "orange",
  SEQUENCE = "sequence",
}

export enum GameMode {
  NETWORK = "network",
  PASS_AND_PLAY = "pass_and_play",
}

export enum IGameHintsLevel {
  // Direct hints & game deductions are displayed (TBD)
  ALL = "all",
  // Direct hints are displayed
  DIRECT = "direct",
  // No hints displayd
  NONE = "none",
}

export enum IGameStatus {
  LOBBY = "lobby",
  ONGOING = "ongoing",
  OVER = "over",
}

export enum IColor {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
  WHITE = "white",
  YELLOW = "yellow",
  MULTICOLOR = "multicolor",
  RAINBOW = "rainbow",
  ORANGE = "orange",
}

export enum IInsightColor {
  Play = "#B7E1BC",
  Discard = "#fdfd96",
  Other = "#666",
  Dangerous = "#820000",
  Hint = "#A2D3F6",
}

export type INumber = 1 | 2 | 3 | 4 | 5;

export enum IHintLevel {
  IMPOSSIBLE = 0,
  POSSIBLE = 1,
  SURE = 2,
}

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
  receivedHints?: ITurn[];
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
  cardsIndex?: number[];
}

export type IAction = IDiscardAction | IPlayAction | IHintAction;

export interface ITurn {
  action: IAction;
  card?: ICard;
}

export interface IMessage {
  id: ID;
  content: string;
  from: number;
  turn: number;
}

export interface IPlayer {
  id: string;
  name: string;
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

export function rebuildGame(state: Partial<IGameState>) {
  if (!state) {
    return null;
  }

  let newState = newGame(state.options);

  state.players.forEach(player => {
    newState = joinGame(newState, player);
  });

  state.turnsHistory.forEach(turn => {
    newState = commitAction(newState, turn.action);
  });

  newState.messages = state.messages;
  newState.status = state.status;
  newState.createdAt = state.createdAt;
  newState.nextGameId = state.nextGameId ?? null;

  return newState;
}

export function cleanState(state: IGameState): Partial<IGameState> {
  return {
    ...omit(state, ["playedCards", "drawPile", "discardPile"]),
    players: state.players.map(player => {
      return omit(player, "hand");
    }),
    turnsHistory: state.turnsHistory.map(turn => {
      return {
        action: omit(turn.action, ["card"]) as IAction,
      };
    }),
  };
}

// empty arrays are returned as null in Firebase, so we fill
// them back to avoid having to type check everywhere
export function fillEmptyValues(state: IGameState): IGameState {
  if (!state) {
    return null;
  }

  return defaults(state, {
    playedCards: [],
    drawPile: [],
    discardPile: [],
    messages: [],
    players: (state.players || []).map(player =>
      defaults(player, {
        hand: [],
      })
    ),
    turnsHistory: [],
  });
}
