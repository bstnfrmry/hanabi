import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import shortid from "shortid";

import { newGame } from "../game/actions";
import withDatabase from "../concerns/withDatabase";

import "../styles/tachyons.css";
import "../styles/style.css";

function Home({ db }) {
  const router = useRouter();
  const [seed, setSeed] = useState(1234);
  const [multicolor, setMulticolor] = useState(false);

  async function createGame() {
    const gameId = shortid();

    await db
      .ref(`/games/${gameId}`)
      .set(newGame({ multicolor, playersCount: 4 }, seed));

    router.push(`/lobby?gameId=${gameId}`);
  }

  return (
    <>
      <Head>
        <title>Hanabi</title>
      </Head>
      <label>
        Seed:
        <input
          type="text"
          value={seed}
          onChange={e => setSeed(e.target.value)}
        />
      </label>
      <label>
        Multicolor:
        <input
          type="checkbox"
          checked={multicolor}
          onChange={e => setMulticolor(e.target.checked)}
        />
      </label>

      <button onClick={() => createGame()}>New game</button>
    </>
  );
}

export default withDatabase(Home);
