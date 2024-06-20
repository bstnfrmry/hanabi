import IGameState, { IGameStatus } from "~/lib/state";

export function isGameFinished(game: IGameState) {
  return game.status === IGameStatus.OVER || game.originalGame?.status === IGameStatus.OVER;
}
