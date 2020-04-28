import classnames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import shortid from "shortid";

import HomeButton from "~/components/homeButton";
import Button, { ButtonSize } from "~/components/ui/button";
import { Checkbox, Field, Select, TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { newGame } from "~/game/actions";
import { GameMode, GameVariant, IGameHintsLevel } from "~/game/state";
import useNetwork from "~/hooks/network";

const PlayerCounts = [2, 3, 4, 5];

const Variants = {
  [GameVariant.CLASSIC]: "Classic",
  [GameVariant.MULTICOLOR]: "Multicolor",
  [GameVariant.RAINBOW]: "Rainbow"
};

const VariantDescriptions = {
  [GameVariant.CLASSIC]: "A classic game of Hanabi with 5 colors",
  [GameVariant.MULTICOLOR]: "A 6th suite is added with only one card of each",
  [GameVariant.RAINBOW]: "A 6th suite is added that matches every color"
};

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
  const [variant, setVariant] = useState(GameVariant.CLASSIC);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(false);
  const [private_, setPrivate] = useState(false);
  const [hintsLevel, setHintsLevel] = useState(IGameHintsLevel.DIRECT);
  const [turnsHistory, setTurnsHistory] = useState(true);
  const [botsWait, setBotsWait] = useState(
    process.env.NODE_ENV === "production" ? 1000 : 0
  );

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
        variant,
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
        <div className="flex justify-between ph1 items-center pb4 mb4 bb b--yellow-light">
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

        <div className="flex flex-column pb2 mb2 bb b--yellow-light ph1">
          <div className="flex justify-between items-center">
            <Txt size={TxtSize.MEDIUM} value="Mode" />
            <div className="flex flex-column flex-row-l justify-end">
              {Object.entries(Variants).map(([gameVariant, label]) => {
                return (
                  <Button
                    key={gameVariant}
                    className={classnames("ph1 ph3-l pv2 mt2 mt0-l", {
                      "bg-lavender": variant !== gameVariant,
                      "z-5": variant === gameVariant
                    })}
                    size={ButtonSize.SMALL}
                    style={{
                      ...(variant === gameVariant && {
                        transform: "scale(1.20)"
                      })
                    }}
                    text={`${label}`}
                    onClick={() => setVariant(gameVariant as GameVariant)}
                  />
                );
              })}
            </div>
          </div>
          <Txt
            className="lavender mt4 self-end"
            size={TxtSize.SMALL}
            value={VariantDescriptions[variant]}
          />
        </div>

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
        <Txt className="f4 mt4 mb4 tc lavender">
          {offline
            ? `In this pass-and-play mode, you can play offline with multiple
              players that are physically in the same room by passing the device to each player on their turn`
            : `You will be able to play online by sharing the game link to your
            friends.`}
        </Txt>
        <div className="flex justify-center">
          <Button
            className="justify-end mt2"
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
