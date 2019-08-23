import React, { useState } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import { useDatabase } from "../hooks/database";
import { newGame } from "../game/actions";
import Button from "../components/button";

const PlayerCounts = [2, 3, 4, 5];

export default function NewGame() {
  const router = useRouter();
  const db = useDatabase();
  const [seed, setSeed] = useState(Math.round(Math.random() * 10000));
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
    <>
      <div className="w-100 h-100 flex justify-center items-center">
        <div className="flex flex-column w-50 pv2 ph4 bg-grey bg-gray-light">
          <h1>New game</h1>
          <label className="flex justify-between items-center bb b--gray-light pb2 mb2">
            Seed
            <input
              className="w3 tr"
              type="number"
              value={seed}
              onChange={e => setSeed(e.target.value)}
            />
          </label>
          <label className="flex justify-between items-center bb b--gray-light pb2 mb2">
            Players
            <select
              className="bg-white"
              value={playersCount}
              onChange={e => setPlayersCount(+e.target.value)}
            >
              {PlayerCounts.map(count => (
                <option value={count}>{count}</option>
              ))}
            </select>
          </label>
          <label className="flex justify-between items-center bb b--gray-light pb2 mb2">
            Multicolor
            <input
              type="checkbox"
              checked={multicolor}
              onChange={e => setMulticolor(e.target.checked)}
            />
          </label>
          <label className="flex justify-between items-center bb b--gray-light pb2 mb2">
            Allow rollback
            <input
              type="checkbox"
              checked={allowRollback}
              onChange={e => setAllowRollback(e.target.checked)}
            />
          </label>
          <label className="flex justify-between items-center bb b--gray-light pb2 mb2">
            Prevent loss
            <input
              type="checkbox"
              checked={preventLoss}
              onChange={e => setPreventLoss(e.target.checked)}
            />
          </label>

          <div className="self-end">
            <Button onClick={() => createGame()}>New game</Button>
          </div>
        </div>
      </div>
    </>
  );
}
