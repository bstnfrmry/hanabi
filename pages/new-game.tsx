import React, { useState } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import { useDatabase } from "~/hooks/database";
import { newGame } from "~/game/actions";

import Button, { IButtonSize } from "~/components/ui/button";
import Box from "~/components/ui/box";
import HomeButton from "~/components/homeButton";

const PlayerCounts = [2, 3, 4, 5];

const DefaultSeed = `${Math.round(Math.random() * 10000)}`;

export default function NewGame() {
  const router = useRouter();
  const db = useDatabase();
  const [seed, setSeed] = useState<string>(DefaultSeed);
  const [playersCount, setPlayersCount] = useState(2);
  const [multicolor, setMulticolor] = useState(false);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(false);

  async function onCreateGame() {
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
    <Box className="w-100 h-100 flex justify-center items-center relative bg-main-dark">
      <HomeButton className="absolute top-1 right-1" />
      <div className="flex flex-column justify-center w-50 f4">
        <label className="flex justify-between items-center pb2 mb2 bb b--yellow-light ph1 h2">
          Seed
          <input
            className="w3 h1 tr bg-white pv2 ph3 br2 ba b--yellow"
            value={seed}
            onChange={e => setSeed(e.target.value)}
          />
        </label>
        <label className="flex justify-between items-center pb2 mb2 bb b--yellow-light ph1 h2">
          Players
          <select
            className="w3 h2 bg-white br2 tc indent ba b--yellow"
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
        <label className="flex justify-between items-center pb2 mb2 bb b--yellow-light ph1 h2">
          Multicolor
          <input
            className="w1 h1"
            type="checkbox"
            checked={multicolor}
            onChange={e => setMulticolor(e.target.checked)}
          />
        </label>
        <label className="flex justify-between items-center pb2 mb2 bb b--yellow-light ph1 h2">
          Allow rollback
          <input
            className="w1 h1"
            type="checkbox"
            checked={allowRollback}
            onChange={e => setAllowRollback(e.target.checked)}
          />
        </label>
        <label className="flex justify-between items-center pb2 mb2 bb b--yellow-light ph1 h2">
          Prevent loss
          <input
            className="w1 h1"
            type="checkbox"
            checked={preventLoss}
            onChange={e => setPreventLoss(e.target.checked)}
          />
        </label>

        <div className="self-end mt3">
          <Button size={IButtonSize.LARGE} onClick={onCreateGame}>
            New game
          </Button>
        </div>
      </div>
    </Box>
  );
}
