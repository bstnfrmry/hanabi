import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import generate from "project-name-generator";
import shortid from "shortid";

import { useDatabase } from "../context/database";

import "../styles/tachyons.css";
import "../styles/style.css";

export default function Lobby() {
  const router = useRouter();
  const db = useDatabase();

  const { gameId, playerId } = router.query;
  const [game, setGame] = useState(null);
  const [name, setName] = useState(generate().dashed);

  useEffect(() => {
    const gameRef = db.ref(`/games/${gameId}`);

    gameRef.on("value", event => {
      const snapshot = event.val();

      if (!snapshot) {
        return router.push("/");
      }

      if (snapshot.status === "ongoing") {
        router.push({
          pathname: `/play`,
          query: { gameId, playerId }
        });
      }

      setGame(snapshot);
    });

    return () => gameRef.off();
  }, [gameId, playerId]);

  async function joinGame(event) {
    event.preventDefault();

    const playerId = shortid();

    await db.ref(`/games/${gameId}/players/${playerId}`).set({ name });

    router.replace({
      pathname: "/lobby",
      query: { gameId, playerId }
    });
  }

  async function startGame() {
    await db.ref(`/games/${gameId}/status`).set("ongoing");
  }

  if (!game) {
    return "No game";
  }

  const player = game && game.players && game.players[playerId];
  const players = Object.values(game.players || {});
  const canStart = players.length > 1 && players.length < 6;

  return (
    <>
      <Head>
        <title>Hanabi</title>
      </Head>
      <div className="aspect-ratio--object">
        <h1>Lobby for game {gameId}</h1>

        {player && <h2>Joined as {player.name}</h2>}

        <p>Share this link to other players</p>

        <h2>Players:</h2>
        {players.map((player, i) => (
          <p key={i}>{player.name}</p>
        ))}

        <hr />

        {!player && (
          <form>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button onClick={e => joinGame(e)}>Join game</button>
          </form>
        )}

        <hr />

        <button disabled={!canStart} onClick={() => startGame()}>
          Start game
        </button>
      </div>
    </>
  );
}
