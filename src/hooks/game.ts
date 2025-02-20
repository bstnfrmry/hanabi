import React, { useContext } from "react";
import { useReplay } from "~/hooks/replay";
import { useSession } from "~/hooks/session";
import { getStateAtTurn } from "~/lib/actions";
import IGameState, { fillEmptyValues, GameMode } from "~/lib/state";
import useLocalStorage from "~/hooks/localStorage";

export const GameContext = React.createContext<IGameState>(null);

export function useColorBlindMode() {
  const game = useGame();
  const [persistedColorBlindMode] = useLocalStorage("colorBlindMode", false);
  if (game) {
    return game.options.colorBlindMode;
  }
  return persistedColorBlindMode;
}
export function useGame() {
  const game = useContext<IGameState>(GameContext);
  const replay = useReplay();

  if (replay && replay.cursor !== null) {
    return {
      ...fillEmptyValues(getStateAtTurn(game, replay.cursor)),
      originalGame: game,
      reviewComments: [...game.reviewComments],
    };
  }

  return game;
}

export function useCurrentPlayer(game: IGameState) {
  if (!game) {
    return null;
  }

  return game.players[game.currentPlayer];
}

export function useSelfPlayer(game: IGameState) {
  const { playerId } = useSession();
  const currentPlayer = useCurrentPlayer(game);

  if (!game) {
    return null;
  }

  if (game.options.gameMode === GameMode.NETWORK) {
    return game.players.find((p) => p.id === playerId);
  }

  if (game.options.gameMode === GameMode.PASS_AND_PLAY) {
    return currentPlayer;
  }
}
