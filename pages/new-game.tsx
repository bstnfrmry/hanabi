import { keyBy } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import shortid from "shortid";

import HomeButton from "~/components/homeButton";
import Box from "~/components/ui/box";
import Button, { ButtonSize } from "~/components/ui/button";
import { Checkbox, Field, Select, TextInput } from "~/components/ui/forms";
import Txt from "~/components/ui/txt";
import { newGame } from "~/game/actions";
import { IGameHintsLevel } from "~/game/state";
import { useDatabase } from "~/hooks/database";

const PlayerCounts = [2, 3, 4, 5];

const HintsLevels = {
  [IGameHintsLevel.DIRECT]: "Show direct hints",
  [IGameHintsLevel.NONE]: "Do not show hints"
};

const DefaultSeed = `${Math.round(Math.random() * 10000)}`;

export default function NewGame() {
  const router = useRouter();
  const db = useDatabase();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState<string>(DefaultSeed);
  const [playersCount, setPlayersCount] = useState(3);
  const [multicolor, setMulticolor] = useState(false);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(false);
  const [private_, setPrivate] = useState(false);
  const [hintsLevel, setHintsLevel] = useState(IGameHintsLevel.DIRECT);
  const [turnsHistory, setTurnsHistory] = useState(true);

  async function onCreateGame() {
    const gameId = shortid();

    await db.ref(`/games/${gameId}`).set(
      newGame({
        id: gameId,
        multicolor,
        playersCount,
        seed,
        allowRollback,
        preventLoss,
        private: private_,
        hintsLevel,
        turnsHistory
      })
    );

    router.push(`/play?gameId=${gameId}`);
  }

  return (
    <Box className="w-100 h-100 overflow-y-scroll pv4 flex justify-center items-start pv6-l relative bg-main-dark">
      <HomeButton className="absolute top-1 right-1" />

      <div className="flex flex-column justify-center w-50">
        <Field label="Players" className="pb2 mb2 bb b--yellow-light">
          <Select
            className="w3 indent"
            options={keyBy(PlayerCounts)}
            value={playersCount}
            onChange={e => setPlayersCount(+e.target.value)}
          />
        </Field>

        <Field label="Multicolor" className="pb2 mb2 bb b--yellow-light">
          <Checkbox
            checked={multicolor}
            onChange={e => setMulticolor(e.target.checked)}
          />
        </Field>

        <Field label="Private">
          <Checkbox
            checked={private_}
            onChange={e => setPrivate(e.target.checked)}
          />
        </Field>

        <a
          className="mv4 self-end underline pointer silver"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Txt content="Advanced options" />
        </a>

        {showAdvanced && (
          <>
            <Field label="Seed" className="pb2 mb2 bb b--yellow-light">
              <TextInput
                className="w3 tr"
                value={seed}
                onChange={e => setSeed(e.target.value)}
              />
            </Field>

            <Field
              label="Allow rollback"
              className="pb2 mb2 bb b--yellow-light"
            >
              <Checkbox
                checked={allowRollback}
                onChange={e => setAllowRollback(e.target.checked)}
              />
            </Field>

            <Field label="Prevent loss" className="pb2 mb2 bb b--yellow-light">
              <Checkbox
                checked={preventLoss}
                onChange={e => setPreventLoss(e.target.checked)}
              />
            </Field>

            <Field label="Hints" className="pb2 mb2 bb b--yellow-light">
              <Select
                className="pl3"
                options={HintsLevels}
                value={hintsLevel}
                onChange={e => setHintsLevel(e.target.value as IGameHintsLevel)}
              />
            </Field>

            <Field label="Turns history" className="pb2 mb2 bb b--yellow-light">
              <Checkbox
                checked={turnsHistory}
                onChange={e => setTurnsHistory(e.target.checked)}
              />
            </Field>
          </>
        )}

        <Button
          size={ButtonSize.LARGE}
          onClick={onCreateGame}
          className="self-end mt3"
          text="New game"
        />
      </div>
    </Box>
  );
}
