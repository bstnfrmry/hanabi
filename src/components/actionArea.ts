import { IPlayer } from "~/game/state";

interface IOtherPlayerSelectedArea {
  id: string;
  type: ActionAreaType.OTHER_PLAYER;
  player: IPlayer;
  cardIndex?: number;
}

interface ISelfPlayerSelectedArea {
  id: string;
  type: ActionAreaType.SELF_PLAYER;
  player: IPlayer;
  cardIndex?: number;
}

interface IInstructionsSelectedArea {
  id: "instructions";
  type: ActionAreaType.INSTRUCTIONS;
}

interface IMenuArea {
  id: "menu";
  type: ActionAreaType.MENU;
}

interface IRollbackArea {
  id: "rollback";
  type: ActionAreaType.ROLLBACK;
}

export enum ActionAreaType {
  INSTRUCTIONS,
  OTHER_PLAYER,
  SELF_PLAYER,
  DISCARD,
  MENU,
  ROLLBACK
}

export type ISelectedArea =
  | IInstructionsSelectedArea
  | IOtherPlayerSelectedArea
  | ISelfPlayerSelectedArea
  | IMenuArea
  | IRollbackArea;
