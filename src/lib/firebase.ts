import firebase from "firebase/app";
import "firebase/database";
import { cloneDeep } from "lodash";

import IGameState, { cleanState, fillEmptyValues, GameMode, IGameStatus, IPlayer, rebuildGame } from "~/lib/state";

function database() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      // Local database configuration using firebase-server
      ...(process.env.FIREBASE_DATABASE_URL && {
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      }),
      // Online database configuration
      ...(process.env.FIREBASE_API_KEY && {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      }),
    });
  }

  return firebase.database();
}

export function loadPublicGames() {
  const ref = database()
    .ref("/games")
    // Only games created less than 10 minutes ago
    .orderByChild("createdAt")
    .startAt(Date.now() - 10 * 60 * 1000);

  return new Promise(resolve => {
    ref.once("value", event => {
      const games = Object.values(event.val() || {})
        .map(fillEmptyValues)
        // Game is public
        .filter(gameIsPublic);

      resolve(games);
    });
  });
}

export function subscribeToPublicGames(callback: (games: IGameState[]) => void) {
  const ref = database()
    .ref("/games")
    // Only games created less than 10 minutes ago
    .orderByChild("createdAt")
    .startAt(Date.now() - 10 * 60 * 1000);

  ref.on("value", event => {
    const games = Object.values(event.val() || {})
      .map(fillEmptyValues)
      // Game is public
      .filter(gameIsPublic);

    callback(games);
  });

  return () => ref.off();
}

export async function loadGame(gameId: string) {
  const ref = database().ref(`/games/${gameId}`);

  return new Promise<IGameState>(resolve => {
    ref.once("value", event => {
      resolve(rebuildGame(fillEmptyValues(event.val())));
    });
  });
}

export function subscribeToGame(gameId: string, callback: (game: IGameState) => void) {
  const ref = database().ref(`/games/${gameId}`);

  ref.on("value", event => {
    callback(rebuildGame(fillEmptyValues(event.val() as IGameState)));
  });

  return () => ref.off();
}

export async function updateGame(game: IGameState) {
  window["hanabi"] = cloneDeep(game);

  await database()
    .ref(`/games/${game.id}`)
    .set(cleanState(game));
}

export async function setReaction(game: IGameState, player: IPlayer, reaction: string) {
  await database()
    .ref(`/games/${game.id}/players/${player.index}/reaction`)
    .set(reaction);
}

export async function setNotification(game: IGameState, player: IPlayer, notified: boolean) {
  await database()
    .ref(`/games/${game.id}/players/${player.index}/notified`)
    .set(notified);
}

function gameIsPublic(game: IGameState) {
  return (
    !game.options.private &&
    game.status === IGameStatus.LOBBY &&
    game.options.gameMode === GameMode.NETWORK &&
    game.players.length &&
    game.players.length < game.options.playersCount
  );
}
