import React, { useState } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import { useDatabase } from "../context/database";

import { newGame } from "../game/actions";
import Button from "../components/button";

export default function NewGame() {
  const router = useRouter();
  const db = useDatabase();
  const [seed, setSeed] = useState(1234);
  const [playersCount, setPlayersCount] = useState(2);
  const [multicolor, setMulticolor] = useState(false);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(true);

  async function createGame() {
    const gameId = shortid();

    await db.ref(`/games/${gameId}`).set(
      newGame({
        multicolor,
        playersCount,
        seed,
        allowRollback,
        preventLoss
      })
    );

    router.push(`/play?gameId=${gameId}`);
  }

  return (
    <div className="pa4 bg-grey bt bg-gray-light">
      <label>
        Seed:
        <input
          type="text"
          value={seed}
          onChange={e => setSeed(e.target.value)}
        />
      </label>
      <label>
        Players:
        <input
          type="number"
          min="2"
          max="5"
          step="1"
          value={playersCount}
          onChange={e => setPlayersCount(+e.target.value)}
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
      <label>
        Allow rollback:
        <input
          type="checkbox"
          checked={allowRollback}
          onChange={e => setAllowRollback(e.target.checked)}
        />
      </label>
      <label>
        Prevent loss:
        <input
          type="checkbox"
          checked={preventLoss}
          onChange={e => setPreventLoss(e.target.checked)}
        />
      </label>

      <Button onClick={() => createGame()}>New game</Button>
    </div>
  );
}
