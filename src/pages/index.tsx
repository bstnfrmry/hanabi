import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Rules from "~/components/rules";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import useLocalStorage from "~/hooks/localStorage";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showRules, setShowRules] = useState(false);
  const [gameId] = useLocalStorage("gameId", null);
  const [playerId] = useLocalStorage("playerId", null);

  const lastGame = gameId && playerId ? { gameId } : null;

  return (
    <div className="w-100 h-100 flex flex-column justify-center items-center bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <div className="flex flex-column items-center">
        <img alt={t("landingImageAlt", "Hanabi cards game online logo")} className="mw4 mb4" src="/static/hanabi.png" />
        <Txt size={TxtSize.LARGE} value={t("hanabi", "Hanabi")} />
      </div>
      <span className="tc lavender">{t("tagline", "Play the Hanabi game online with friends!")}</span>
      <div className="flex flex-column mt5">
        <Button
          className="mb4"
          id="create-room"
          size={ButtonSize.LARGE}
          text={t("createRoom", "Create a room")}
          onClick={() => router.push("/new-game")}
        />
        <Button
          className="mb4"
          id="join-room"
          size={ButtonSize.LARGE}
          text={t("joinRoom", "Join a room")}
          onClick={() => router.push("/join-game")}
        />
        {lastGame && (
          <Button
            className="mb4"
            id="rejoin-game"
            size={ButtonSize.LARGE}
            text={t("rejoinGame", "Rejoin game")}
            onClick={() =>
              router.replace({
                pathname: "/play",
                query: lastGame,
              })
            }
          />
        )}
        <span className="tc pointer" onClick={() => setShowRules(true)}>
          {t("whatsHanabi", "What's Hanabi?")}
        </span>
        {showRules && <Rules setShowRules={setShowRules} />}
      </div>
    </div>
  );
}
