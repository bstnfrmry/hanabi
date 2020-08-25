import classnames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import HomeButton from "~/components/homeButton";
import Button, { ButtonSize } from "~/components/ui/button";
import { Checkbox, Field, Select, TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { newGame } from "~/lib/actions";
import { logEvent } from "~/lib/analytics";
import { updateGame } from "~/lib/firebase";
import { readableUniqueId } from "~/lib/id";
import { GameMode, GameVariant, IGameHintsLevel } from "~/lib/state";

const PlayerCounts = [2, 3, 4, 5];

const Variants = {
  [GameVariant.CLASSIC]: "classicVariant",
  [GameVariant.MULTICOLOR]: "multicolorVariant",
  [GameVariant.RAINBOW]: "rainbowVariant",
  [GameVariant.ORANGE]: "orangeVariant",
  [GameVariant.SEQUENCE]: "sequenceVariant",
};

const VariantDescriptions = {
  [GameVariant.CLASSIC]: "classicVariantDescription",
  [GameVariant.MULTICOLOR]: "multicolorVariantDescription",
  [GameVariant.RAINBOW]: "rainbowVariantDescription",
  [GameVariant.ORANGE]: "orangeVariantDescription",
  [GameVariant.SEQUENCE]: "sequenceVariantDescription",
};

const HintsLevels = {
  [IGameHintsLevel.DIRECT]: "showDirectHints",
  [IGameHintsLevel.NONE]: "hideDirectHints",
};

const BotsSpeeds = {
  0: "faster",
  1000: "fast",
  3000: "slow",
};

export default function NewGame() {
  const router = useRouter();
  const { t } = useTranslation();

  const [offline, setOffline] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState<string>();
  const [playersCount, setPlayersCount] = useState(3);
  const [variant, setVariant] = useState(GameVariant.CLASSIC);
  const [allowRollback, setAllowRollback] = useState(true);
  const [preventLoss, setPreventLoss] = useState(false);
  const [private_, setPrivate] = useState(false);
  const [hintsLevel, setHintsLevel] = useState(IGameHintsLevel.DIRECT);
  const [turnsHistory] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [botsWait, setBotsWait] = useState(process.env.NODE_ENV === "production" ? 1000 : 0);

  const [creatingGame, setCreatingGame] = useState(false);

  /**
   * Initialise seed on first render
   */
  useEffect(() => {
    setSeed(`${Math.round(Math.random() * 10000)}`);
  }, []);

  async function onCreateGame() {
    const gameId = readableUniqueId();

    setCreatingGame(true);

    await updateGame(
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
        colorBlindMode,
        gameMode: offline ? GameMode.PASS_AND_PLAY : GameMode.NETWORK,
      })
    );

    logEvent("Game", "Game created");

    router.push(`/${gameId}`);
  }

  return (
    <div className="w-100 h-100 overflow-y-scroll pv4 flex items-center pv6-l relative bg-main-dark ph2 ph3-l shadow-5 br3">
      <HomeButton className="absolute top-1 right-1" />
      <div className="flex flex-column w-75-m w-70-l w-80" style={{ margin: "auto" }}>
        <div className="flex justify-between ph1 items-center pb4 mb4 bb b--yellow-light">
          <Txt size={TxtSize.MEDIUM} value={t("players", "Players")} />
          <div className="flex">
            {PlayerCounts.map(count => {
              return (
                <Button
                  key={count}
                  className={classnames("ph3 ph4-l pv2", {
                    "bg-lavender": playersCount !== count,
                    "z-5": playersCount === count,
                  })}
                  size={ButtonSize.SMALL}
                  style={{
                    ...(playersCount === count && {
                      transform: "scale(1.20)",
                    }),
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
            <Txt size={TxtSize.MEDIUM} value={t("mode", "Mode")} />
            <div className="flex flex-wrap-l flex-column flex-row-l justify-end">
              {Object.entries(Variants).map(([gameVariant, label]) => {
                return (
                  <Button
                    key={gameVariant}
                    className={classnames("ph1 ph3-l pv2 mt2 mt0-l w-30-l ml1-l mt1-l", {
                      "bg-lavender": variant !== gameVariant,
                      "z-5": variant === gameVariant,
                    })}
                    size={ButtonSize.SMALL}
                    style={{
                      ...(variant === gameVariant && {
                        transform: "scale(1.20)",
                      }),
                    }}
                    text={t(label)}
                    onClick={() => setVariant(gameVariant as GameVariant)}
                  />
                );
              })}
            </div>
          </div>
          <Txt className="lavender mt4 self-end" size={TxtSize.SMALL} value={t(VariantDescriptions[variant])} />
        </div>

        <a
          className="flex flex-column items-end mv4 self-end  pointer silver"
          id="advanced-options"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Txt className="lavender underline" value={t("advancedOptions", "Advanced options")} />
          <Txt className="yellow mt2" value={`💎 ${t("new", "New!")} ${t("colorBlindMode", "Color blind mode")}`} />
        </a>

        {showAdvanced && (
          <>
            <Field
              className="pb3 mb3  bb b--yellow-light"
              label={t("passandplay", "Pass & Play")}
              subText={t("passandplaySubtext", "Physically pass the device to each player on their turn")}
            >
              <Checkbox checked={offline} id="offline" onChange={e => setOffline(e.target.checked)} />
            </Field>

            <Field
              className="pb3 mb3 bb b--yellow-light"
              label={t("colorBlindMode", "Color blind mode")}
              subText={t("colorBlindModeSubtext", "Display symbols on top of cards to help distinguish colors")}
            >
              <Checkbox checked={colorBlindMode} onChange={e => setColorBlindMode(e.target.checked)} />
            </Field>

            <Field
              className="pb3 mb3 bb b--yellow-light"
              label={t("private", "Private")}
              subText={t("privateSubtext", "Your game won't be visible in the 'Join Room' section")}
            >
              <Checkbox checked={private_} onChange={e => setPrivate(e.target.checked)} />
            </Field>

            <Field className="pb3 mb3 bb b--yellow-light" label={t("seed", "Seed")}>
              <TextInput className="w3 tr" id="seed" value={seed} onChange={e => setSeed(e.target.value)} />
            </Field>

            <Field className="pb3 mb3 bb b--yellow-light" label={t("allowRollback", "Allow rollback")}>
              <Checkbox checked={allowRollback} onChange={e => setAllowRollback(e.target.checked)} />
            </Field>

            <Field className="pb3 mb3 bb b--yellow-light" label={t("preventLoss", "Prevent loss")}>
              <Checkbox checked={preventLoss} onChange={e => setPreventLoss(e.target.checked)} />
            </Field>

            <Field className="pb3 mb3 bb b--yellow-light" label={t("hints", "Hints")}>
              <Select
                className="pl3"
                formatter={t}
                options={HintsLevels}
                value={hintsLevel}
                onChange={e => setHintsLevel(e.target.value as IGameHintsLevel)}
              />
            </Field>

            {/* TODO remove dead code
            <Field className="pb2 mb2 bb b--yellow-light" label="Turns history">
              <Checkbox checked={turnsHistory} onChange={e => setTurnsHistory(e.target.checked)} />
            </Field> */}

            <Field label={t("botSpeed", "Bots speed")}>
              <Select
                className="pl3"
                formatter={t}
                id="bots-speed"
                options={BotsSpeeds}
                value={botsWait}
                onChange={e => setBotsWait(+e.target.value)}
              />
            </Field>
          </>
        )}
        <Txt
          className="f4 mt4 mb4 tc lavender"
          value={
            offline
              ? t(
                  "passandplayExplanation",
                  "In this pass-and-play mode, you can play offline with multiple players that are physically in the same room by passing the device to each player on their turn"
                )
              : t("normalGameExplanation", "You will be able to play online by sharing the game link to your friends.")
          }
        />
        <div className="flex justify-center">
          <Button
            className="justify-end mt2"
            id="new-game"
            primary={!creatingGame}
            size={ButtonSize.LARGE}
            text={creatingGame ? t("creatingGame") : t("newGame")}
            onClick={onCreateGame}
          />
        </div>
      </div>
    </div>
  );
}
