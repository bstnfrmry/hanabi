import { keyBy } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import shortid from "shortid";

import HomeButton from "~/components/homeButton";
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
    <div className="w-100 h-100 overflow-y-scroll pv4 flex justify-center items-start pv6-l relative bg-main-dark ph2 ph3-l shadow-5 br3">
      <HomeButton className="absolute top-1 right-1" />

      <div className="flex flex-column justify-center w-50">
        <Field className="pb2 mb2 bb b--yellow-light" label="Players">
          <Select
            className="w3 indent"
            options={keyBy(PlayerCounts)}
            value={playersCount}
            onChange={e => setPlayersCount(+e.target.value)}
          />
        </Field>

        <Field className="pb2 mb2 bb b--yellow-light" label="Multicolor">
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
          <Txt value="Advanced options" />
        </a>

        {showAdvanced && (
          <>
            <Field className="pb2 mb2 bb b--yellow-light" label="Seed">
              <TextInput
                className="w3 tr"
                value={seed}
                onChange={e => setSeed(e.target.value)}
              />
            </Field>

            <Field
              className="pb2 mb2 bb b--yellow-light"
              label="Allow rollback"
            >
              <Checkbox
                checked={allowRollback}
                onChange={e => setAllowRollback(e.target.checked)}
              />
            </Field>

            <Field className="pb2 mb2 bb b--yellow-light" label="Prevent loss">
              <Checkbox
                checked={preventLoss}
                onChange={e => setPreventLoss(e.target.checked)}
              />
            </Field>

            <Field className="pb2 mb2 bb b--yellow-light" label="Hints">
              <Select
                className="pl3"
                options={HintsLevels}
                value={hintsLevel}
                onChange={e => setHintsLevel(e.target.value as IGameHintsLevel)}
              />
            </Field>

            <Field className="pb2 mb2 bb b--yellow-light" label="Turns history">
              <Checkbox
                checked={turnsHistory}
                onChange={e => setTurnsHistory(e.target.checked)}
              />
            </Field>
          </>
        )}

        <Button
          className="self-end mt3"
          size={ButtonSize.LARGE}
          text="New game"
          onClick={onCreateGame}
        />
      </div>
    </div>
  );
}
