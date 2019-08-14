import React, { useState, useEffect } from "react";

import PlayersBoard from "./playersBoard";
import GameBoard from "./gameBoard";
import ActionArea, { ActionAreaType } from "./actionArea";
import { useDatabase } from "../context/database";

export default function App({ gameId, playerId }) {
  const [game, setGame] = useState(null);
  const db = useDatabase();
  const [selectedArea, selectArea] = useState(null);

  useEffect(() => {
    db.ref(`/games/${gameId}`).on("value", event => {
      setGame(event.val());
    });
  }, []);

  if (!game) {
    return "Loading";
  }

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
}
