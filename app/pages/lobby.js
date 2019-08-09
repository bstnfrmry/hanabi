import React, { useState, useEffect } from "react";
import Head from "next/head";
import generate from "project-name-generator";
import shortid from "shortid";

import withDatabase from "../concerns/withDatabase";
import "../styles/tachyons.css";
import "../styles/style.css";
import Router from "next/router";

const defaultName = generate().dashed;

function Lobby({ gameId, playerId, db }) {
  const [game, setGame] = useState(null);
  const [name, setName] = useState(defaultName);

  const player = game && game.players && game.players[playerId];

  useEffect(() => {
    db.ref(`/games/${gameId}`).on("value", event => {
      const snapshot = event.val();

      if (!snapshot) {
        return Router.push("/");
      }

      if (snapshot.status === "ongoing") {
        Router.push({
          pathname: `/play`,
          query: { gameId, playerId }
        });
      }

      setGame(snapshot);
    });
  }, []);

  async function joinGame(event) {
    event.preventDefault();

    const playerId = shortid();
    console.log(playerId);

    await db.ref(`/games/${gameId}/players/${playerId}`).set({ name });

    Router.push({
      pathname: "/lobby",
      query: { gameId, playerId }
    });
  }

  async function startGame(event) {
    debugger;
    await db.ref(`/games/${gameId}/status`).set("ongoing");
  }

  if (!game) {
    return "No game";
  }

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

const page = withDatabase(Lobby);

page.getInitialProps = ({ query }) => {
  return {
    gameId: query.gameId,
    playerId: query.playerId
  };
};

export default page;
