import { useRouter } from "next/router";
import React, { useContext } from "react";

import { isReplayMode } from "~/game/actions";
import IGameState, {
  fillEmptyValues,
  GameMode,
  IGameStatus
} from "~/game/state";

export const GameContext = React.createContext(null);

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

export function useCurrentPlayer(game: IGameState = useGame()) {
  if (!game) {
    return null;
  }

  return game.players[game.currentPlayer];
}

export function useSelfPlayer(game: IGameState = useGame()) {
  const router = useRouter();
  const currentPlayer = useCurrentPlayer(game);

  const { playerId } = router.query;

  if (!game) {
    return null;
  }

  if (game.options.gameMode === GameMode.NETWORK) {
    return game.players.find(p => p.id === playerId);
  }

  if (game.options.gameMode === GameMode.PASS_AND_PLAY) {
    return currentPlayer;
  }
}
