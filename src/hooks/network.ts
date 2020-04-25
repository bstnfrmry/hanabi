import React, { useContext } from "react";

import IGameState, { IPlayer } from "~/game/state";

export const NetworkContext = React.createContext<Network>(null);

export type GamesHandler = (games: IGameState[]) => void;

export type GameHandler = (game: IGameState) => void;

export type UnsubscribeHandler = () => void;

export interface Network {
  loadPublicGames(): Promise<IGameState[]>;

  subscribeToPublicGames(callback: GamesHandler): UnsubscribeHandler;

  subscribeToOnGoingGames(callback: GamesHandler): UnsubscribeHandler;

  loadGame(gameId: string): Promise<IGameState>;

  subscribeToGame(gameId: string, callback: GameHandler): UnsubscribeHandler;

  updateGame(game: IGameState): Promise<void>;

  setReaction(
    game: IGameState,
    player: IPlayer,
    reaction: string
  ): Promise<void>;

  setNotification(
    game: IGameState,
    player: IPlayer,
    notified: boolean
  ): Promise<void>;
}

export default function useNetwork() {
  return useContext(NetworkContext);
}
