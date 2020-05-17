import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import LanguageSelector from "~/components/languageSelector";
import Rules from "~/components/rules";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import useLocalStorage from "~/hooks/localStorage";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [gameId] = useLocalStorage("gameId", null);
  const [playerId] = useLocalStorage("playerId", null);
  const rulesRef = useRef<HTMLDivElement>();
  const lastGame = gameId && playerId ? { gameId } : null;

  useEffect(() => {
    router.prefetch("/new-game");
    router.prefetch("/join-game");
  }, []);

  return (
    <div className="relative w-100 overflow-y-scroll flex flex-column justify-center items-center bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <div className="absolute top-1 right-2">
        <LanguageSelector outlined />
      </div>
      <div className="vh-100 flex flex-column items-center justify-center">
        <div className="flex flex-column items-center">
          <img
            alt={t("landingImageAlt", "Hanabi cards game online logo")}
            className="mb4 w4 h4"
            src={require("~/images/hanabi.png?size=256")}
          />
          <Txt size={TxtSize.LARGE} value={t("hanabi", "Hanabi")} />
        </div>
        <span className="tc lavender">{t("tagline", "Play the Hanabi game online with friends!")}</span>
        <main className="flex flex-column mt5">
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
              id="join-room"
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

          <span
            className="flex flex-column items-center link white pointer mt4"
            onClick={() => {
              rulesRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>{t("whatsHanabi", "What's Hanabi?")}</span>
            <span>⌄</span>
          </span>
        </main>
      </div>
      <div ref={rulesRef}>
        <Rules />
      </div>
    </div>
  );
}
