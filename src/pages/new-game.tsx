import classnames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import shortid from "shortid";

import HomeButton from "~/components/homeButton";
import Button, { ButtonSize } from "~/components/ui/button";
import { Checkbox, Field, Select, TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { newGame } from "~/game/actions";
import { GameMode, IGameHintsLevel } from "~/game/state";
import useNetwork from "~/hooks/network";

const PlayerCounts = [2, 3, 4, 5];

const HintsLevels = {
  [IGameHintsLevel.DIRECT]: "Show direct hints",
  [IGameHintsLevel.NONE]: "Do not show hints"
};

const BotsSpeeds = {
  0: "Faster",
  1000: "Fast",
  3000: "Slow"
};

export default function NewGame() {
  const router = useRouter();
  const network = useNetwork();

  const [offline, setOffline] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState<string>();
  const [playersCount, setPlayersCount] = useState(3);
  const [multicolor, setMulticolor] = useState(false);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(false);
  const [private_, setPrivate] = useState(false);
  const [hintsLevel, setHintsLevel] = useState(IGameHintsLevel.DIRECT);
  const [turnsHistory, setTurnsHistory] = useState(true);
  const [botsWait, setBotsWait] = useState(1000);

  /**
   * Initialise seed on first render
   */
  useEffect(() => {
    setSeed(`${Math.round(Math.random() * 10000)}`);
  }, []);

  async function onCreateGame() {
    const gameId = shortid();

    network.updateGame(
      newGame({
        id: gameId,
        multicolor,
        playersCount,
        seed,
        allowRollback,
        preventLoss,
        private: private_,
        hintsLevel,
        turnsHistory,
        botsWait,
        gameMode: offline ? GameMode.PASS_AND_PLAY : GameMode.NETWORK
      })
    );

    router.push(`/play?gameId=${gameId}`);
  }

  return (
    <div className="w-100 h-100 overflow-y-scroll pv4 flex items-center pv6-l relative bg-main-dark ph2 ph3-l shadow-5 br3">
      <HomeButton className="absolute top-1 right-1" />
      <div
        className="flex flex-column w-75-m w-50-l w-80"
        style={{ margin: "auto" }}
      >
        <div className="flex justify-between ph1 items-center pb2 mb2 bb b--yellow-light">
          <Txt size={TxtSize.MEDIUM} value="Players" />
          <div className="flex">
            {PlayerCounts.map(count => {
              return (
                <Button
                  key={count}
                  className={classnames("ph3 ph4-l pv2", {
                    "bg-lavender": playersCount !== count,
                    "z-5": playersCount === count
                  })}
                  size={ButtonSize.SMALL}
                  style={{
                    ...(playersCount === count && {
                      transform: "scale(1.20)"
                    })
                  }}
                  text={`${count}`}
                  onClick={() => setPlayersCount(count)}
                />
              );
            })}
          </div>
        </div>

        <Field label="Multicolor">
          <Checkbox
            checked={multicolor}
            id="multicolor"
            onChange={e => setMulticolor(e.target.checked)}
          />
        </Field>

        <a
          className="mv4 self-end underline pointer silver"
          id="advanced-options"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Txt value="Advanced options" />
        </a>

        {showAdvanced && (
          <>
            <Field
              className="pb2 mb2  bb b--yellow-light"
              label="Pass & Play"
              subText="Physically pass the device to each player on their turn"
            >
              <Checkbox
                checked={offline}
                id="offline"
                onChange={e => setOffline(e.target.checked)}
              />
            </Field>

            <Field
              className="pb2 mb2 bb b--yellow-light"
              label="Private"
              subText="Your game won't be visible in the 'Join Room' section"
            >
              <Checkbox
                checked={private_}
                onChange={e => setPrivate(e.target.checked)}
              />
            </Field>

            <Field className="pb2 mb2 bb b--yellow-light" label="Seed">
              <TextInput
                className="w3 tr"
                id="seed"
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

            <Field label="Bots speed">
              <Select
                className="pl3"
                id="bots-speed"
                options={BotsSpeeds}
                value={botsWait}
                onChange={e => setBotsWait(+e.target.value)}
              />
            </Field>
          </>
        )}
        <div className="f4 mt4 mb2 lavender">
          {offline
            ? `In this pass-and-play mode, you can play offline with multiple
              players that are physically in the same room by passing the device to each player on their turn`
            : `You will be able to play online by sharing the game link to your
            friends.`}
        </div>
        <div className="flex flex-1 justify-center">
          <Button
            className="flex-1 justify-end mt2"
            id="new-game"
            size={ButtonSize.LARGE}
            text="New game"
            onClick={onCreateGame}
          />
        </div>
      </div>
    </div>
  );
}