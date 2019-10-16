import React, { useContext } from "react";

import IGameState, { IPlayer } from "~/game/state";

export const GameContext = React.createContext(null);
export const SelfPlayerContext = React.createContext(null);
export const CurrentPlayerContext = React.createContext(null);

export function useGame() {
  return useContext<IGameState>(GameContext);
}

export function useSelfPlayer() {
  return useContext<IPlayer>(SelfPlayerContext);
}

export function useCurrentPlayer() {
  return useContext<IPlayer>(CurrentPlayerContext);
}
