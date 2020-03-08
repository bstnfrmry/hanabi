import "firebase/database";

import firebase from "firebase/app";
import React, { useContext } from "react";

import GameState, { fillEmptyValues, GameStatus, Player } from "../game/state";

const NetworkContext = React.createContext<FirebaseNetwork>(null);

type GamesHandler = (games: GameState[]) => void;

type GameHandler = (game: GameState) => void;

export default class FirebaseNetwork {
  db: firebase.database.Database;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDeWR7W7kmxe4K7jGx7hqe92zJ4w5xl_DY",
        authDomain: "hanabi-df790.firebaseapp.com",
        databaseURL: "https://hanabi-df790.firebaseio.com",
        projectId: "hanabi-df790",
        storageBucket: "",
        messagingSenderId: "681034034410",
        appId: "1:681034034410:web:c90a77231f6b9f36"
      });
    }

    this.db = firebase.database();
  }

  subscribeToPublicGames(callback: GamesHandler) {
    const ref = this.db
      .ref("/games")
      // Only games created less than 10 minutes ago
      .orderByChild("createdAt")
      .startAt(Date.now() - 10 * 60 * 1000);

    ref.on("value", event => {
      const games = Object.values(event.val() || {})
        .map(fillEmptyValues)
        // Game is public
        .filter(
          game =>
            !game.options.private &&
            game.status === GameStatus.LOBBY &&
            game.players.length &&
            game.players.length < game.options.playersCount
        );

      callback(games);
    });

    return () => ref.off();
  }

  subscribeToGame(gameId: string, callback: GameHandler) {
    const ref = this.db.ref(`/games/${gameId}`);

    ref.on("value", event => {
      callback(fillEmptyValues(event.val() as GameState));
    });

    return () => ref.off();
  }

  async updateGame(game: GameState) {
    await this.db.ref(`/games/${game.id}`).set(game);
  }

  async setReaction(game: GameState, player: Player, reaction: string) {
    await this.db
      .ref(`/games/${game.id}/players/${player.index}/reaction`)
      .set(reaction);
  }

  async setNotification(game: GameState, player: Player, notified: boolean) {
    await this.db
      .ref(`/games/${game.id}/players/${player.index}/notified`)
      .set(notified);
  }
}

export function useNetwork() {
  return useContext(NetworkContext);
}

export const NetworkProvider: React.FC = props => {
  const { children } = props;

  const network = new FirebaseNetwork();

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};
