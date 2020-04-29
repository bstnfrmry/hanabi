import { IPlayer } from "~/lib/state";

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

interface ILogsSelectedArea {
  id: "logs";
  type: ActionAreaType.LOGS;
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
  LOGS,
  OTHER_PLAYER,
  SELF_PLAYER,
  DISCARD,
  MENU,
  ROLLBACK,
}

export type ISelectedArea =
  | ILogsSelectedArea
  | IOtherPlayerSelectedArea
  | ISelfPlayerSelectedArea
  | IMenuArea
  | IRollbackArea;
