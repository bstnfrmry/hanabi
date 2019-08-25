import React, { useState } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import { useDatabase } from "~/hooks/database";
import { newGame } from "~/game/actions";

import Button from "~/components/ui/button";
import Box from "~/components/ui/box";

const PlayerCounts = [2, 3, 4, 5];

const DefaultSeed = `${Math.round(Math.random() * 10000)}`;

export default function NewGame() {
  const router = useRouter();
  const db = useDatabase();
  const [seed, setSeed] = useState<string>(DefaultSeed);
  const [playersCount, setPlayersCount] = useState(2);
  const [multicolor, setMulticolor] = useState(false);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(true);

  async function createGame() {
    const gameId = shortid();

    await db.ref(`/games/${gameId}`).set(
      newGame({
        id: gameId,
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
        <Box className="flex flex-column w-50">
          <h1 className="mt0 ttu">New game</h1>
          <label className="flex justify-between items-center pb2 mb2 bb">
            Seed
            <input
              className="w3 tr"
              value={seed}
              onChange={e => setSeed(e.target.value)}
            />
          </label>
          <label className="flex justify-between items-center pb2 mb2 bb">
            Players
            <select
              className="bg-white"
              value={playersCount}
              onChange={e => setPlayersCount(+e.target.value)}
            >
              {PlayerCounts.map(count => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <label className="flex justify-between items-center pb2 mb2 bb">
            Multicolor
            <input
              type="checkbox"
              checked={multicolor}
              onChange={e => setMulticolor(e.target.checked)}
            />
          </label>
          <label className="flex justify-between items-center pb2 mb2 bb">
            Allow rollback
            <input
              type="checkbox"
              checked={allowRollback}
              onChange={e => setAllowRollback(e.target.checked)}
            />
          </label>
          <label className="flex justify-between items-center pb2 mb2 bb">
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
        </Box>
      </div>
    </>
  );
}
