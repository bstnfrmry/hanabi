import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import PlayersBoard from "../components/playersBoard";
import GameBoard from "../components/gameBoard";
import Lobby from "../components/lobby";
import ActionArea, { ActionAreaType } from "../components/actionArea";
import { useDatabase } from "../context/database";
import { joinGame } from "../game/actions";
import play from "../game/ai";

export default function Play() {
  const db = useDatabase();
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [selectedArea, selectArea] = useState(null);

  const { gameId, playerId } = router.query;

  const player =
    game && game.players && game.players.find(p => p.id === playerId);

  useEffect(() => {
    db.ref(`/games/${gameId}`).on("value", event => {
      setGame(event.val());
    });
  }, [gameId, playerId]);

  useEffect(() => {
    db.ref(`/games/${gameId}/currentPlayer`).on("value", event => {
      selectArea(null);
    });
  }, [gameId]);

  if (!game) {
    return "Loading";
  }

  async function onJoinGame(player) {
    const playerId = shortid();

    await db
      .ref(`/games/${gameId}`)
      .set(joinGame(game, { id: playerId, ...player }));

    router.replace({
      pathname: "/play",
      query: { gameId, playerId }
    });
  }

  async function onStartGame() {
    await db.ref(`/games/${gameId}/status`).set("ongoing");
  }

  async function onSimulateTurn() {
    await db.ref(`/games/${gameId}`).set(play(game));
  }

  async function giveHint(from, to, hint) {
    console.log(from, to, hint);
    // @todo send hint to the db
  }

  return (
    <div className="flex flex-row w-100 h-100">
      <PlayersBoard
        game={game}
        player={player}
        onSelectPlayer={player =>
          selectArea({ type: ActionAreaType.PLAYER, player })
        }
      />
      <div className="flex-grow-1 flex flex-column h-100 overflow-scroll bl b--gray-light">
        <GameBoard
          game={game}
          onSelectDiscard={() => selectArea({ type: ActionAreaType.DISCARD })}
          onSimulateTurn={onSimulateTurn}
        />
        {game.status === "lobby" && (
          <Lobby
            game={game}
            player={player}
            onJoinGame={onJoinGame}
            onStartGame={onStartGame}
          />
        )}
        {game.status === "ongoing" && (
          <ActionArea
            game={game}
            selectedArea={selectedArea}
            player={player}
            giveHint={hint =>
              giveHint(
                game.currentPlayer, // from
                _.findIndex(game.players, p => p === selectedArea.player), // to
                hint
              )
            }
          />
        )}
      </div>
    </div>
  );
}
