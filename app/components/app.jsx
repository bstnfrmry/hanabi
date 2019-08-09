import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { cloneDeep } from "lodash";

import PlayersBoard from "./playersBoard";
import GameBoard from "./gameBoard";
import ActionArea, { ActionAreaType } from "./actionArea";

import { newGame } from "../game/actions";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDeWR7W7kmxe4K7jGx7hqe92zJ4w5xl_DY",
  authDomain: "hanabi-df790.firebaseapp.com",
  databaseURL: "https://hanabi-df790.firebaseio.com",
  projectId: "hanabi-df790",
  storageBucket: "",
  messagingSenderId: "681034034410",
  appId: "1:681034034410:web:dff20eb4bcb7274d"
};

export default ({ gameId = "root", seed = "1234" }) => {
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

  const [game, setGame] = useState(null);

  useEffect(() => {
    async function loadGame() {
      const db = firebase.database();
      const gameRef = db.ref(`/games/${gameId}`);

      let gameSnapshot = await gameRef.once("value");
      let game = null;
      if (!gameSnapshot.exists()) {
        game = await gameRef.set(
          newGame(
            {
              multicolor: false,
              playersCount: 4
            },
            seed
          )
        );
      } else {
        game = gameSnapshot.val();
      }

      // gameRef.on("value", function(snapshot) {
      //   console.log(snapshot.val());
      //   setGame(snapshot.val());
      // });

      setGame(game);
    }

    loadGame();
  });

  const [selectedArea, selectArea] = useState(null);

  if (!game) {
    return "Loading";
  }

  const play = async () => {
    await game.play();
    setGame(cloneDeep(game)); // 🤮
  };

  return (
    <div id="app" className="flex flex-row w-100 h-100">
      <PlayersBoard
        game={game}
        onSelectPlayer={player =>
          selectArea({ type: ActionAreaType.PLAYER, player })
        }
      />
      <div className="flex-grow-1 flex flex-column h-100 overflow-scroll bl b--gray-light">
        <GameBoard
          game={game}
          onSelectDiscard={() => selectArea({ type: ActionAreaType.DISCARD })}
          onSimulateTurn={() => play()}
        />
        <ActionArea game={game} selectedArea={selectedArea} />
      </div>
    </div>
  );
};
