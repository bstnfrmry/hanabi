import React, { useContext } from "react";

import { isReplayMode } from "~/game/actions";
import IGameState, {
  fillEmptyValues,
  IGameStatus,
  IPlayer
} from "~/game/state";

export const GameContext = React.createContext(null);
export const SelfPlayerContext = React.createContext(null);

export function useGame() {
  const game = useContext<IGameState>(GameContext);

  if (isReplayMode(game)) {
    return {
      ...fillEmptyValues(game.history[game.replayCursor]),
      originalGame: game,
      status: IGameStatus.OVER,
      replayCursor: game.replayCursor
    };
  }

  return game;
}

export function useSelfPlayer() {
  return useContext<IPlayer>(SelfPlayerContext);
}

export function useCurrentPlayer() {
  const game = useGame();

  return game && game.players[game.currentPlayer];
}
