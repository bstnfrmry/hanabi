import React, { useState } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import { useDatabase } from "../context/database";

import { newGame } from "../game/actions";

export default function Home() {
  const router = useRouter();
  const db = useDatabase();
  const [seed, setSeed] = useState(1234);
  const [multicolor, setMulticolor] = useState(false);

  async function createGame() {
    const gameId = shortid();

    await db
      .ref(`/games/${gameId}`)
      .set(newGame({ multicolor, playersCount: 2, seed }));

    router.push(`/play?gameId=${gameId}`);
  }

  return (
    <>
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
