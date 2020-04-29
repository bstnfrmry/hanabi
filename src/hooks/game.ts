import { useRouter } from "next/router";
import React, { useContext } from "react";

import useLocalStorage from "~/hooks/localStorage";
import { getStateAtTurn } from "~/lib/actions";
import IGameState, { fillEmptyValues, GameMode, IReplay } from "~/lib/state";

export const GameContext = React.createContext(null);

export const ReplayContext = React.createContext(null);

export function useReplay() {
  return useContext<IReplay>(ReplayContext);
}

export function useGame() {
  const game = useContext<IGameState>(GameContext);
  const replay = useReplay();

  if (replay.cursor !== null) {
    return {
      ...fillEmptyValues(getStateAtTurn(game, replay.cursor)),
      originalGame: game,
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

  const [storedPlayerId] = useLocalStorage("playerId", null);

  // Allows overwriting the playerId using the page URL for backwards compatibility
  const playerId = router.query.playerId || storedPlayerId;
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
