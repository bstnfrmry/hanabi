import Fireworks from "fireworks-canvas";
import Head from "next/head";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector, { Languages } from "~/components/languageSelector";
import Rules from "~/components/rules";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import useLocalStorage from "~/hooks/localStorage";
import { logFailedPromise } from "~/lib/errors";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [gameId] = useLocalStorage("gameId", null);
  const [playerId] = useLocalStorage("playerId", null);
  const rulesRef = useRef<HTMLDivElement>();
  const fireworksRef = useRef();

  const lastGame = gameId && playerId ? { gameId } : null;

  useEffect(() => {
    router.prefetch("/new-game").catch(logFailedPromise);
    router.prefetch("/join-game").catch(logFailedPromise);
    router.prefetch("/learn").catch(logFailedPromise);
  }, [router]);

  /**
   * Display fireworks animation when game ends
   */
  useEffect(() => {
    const fireworks = new Fireworks(fireworksRef.current, {
      maxRockets: 15, // max # of rockets to spawn
      rocketSpawnInterval: 150, // milliseconds to check if new rockets should spawn
      numParticles: 100, // number of particles to spawn when rocket explodes (+0-10)
      explosionMinHeight: 10, // minimum percentage of height of container at which rockets explode
      explosionChance: 1, // chance in each tick the rocket will explode
    });
    fireworks.start();

    const timeout = setTimeout(() => {
      fireworks.stop();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="relative w-100 overflow-y-scroll flex flex-column justify-center items-center pa2 pv4-l ph3-l shadow-5 br3"
      style={{
        backgroundImage: "linear-gradient(to bottom right, #001030, #00133d)",
      }}
    >
      <Head>
        <title>Hanab</title>
        <link href="/" hrefLang="x-default" rel="alternate" />
        {Object.keys(Languages).map((locale) => (
          <link key={locale} href={`/${locale}`} hrefLang={locale} rel="alternate" />
        ))}
      </Head>
      <div className="absolute top-1 right-2">
        <LanguageSelector outlined />
      </div>
      <div className="vh-100 flex flex-column items-center justify-center">
        <div className="flex flex-column items-center">
          <div className="mb4 w4 h4">
            <Image
              alt={t("landingImageAlt", "Hanabcards game online logo")}
              height={256}
              priority={true}
              src={"/static/hanab.png"}
              width={256}
            />
          </div>
          <Txt size={TxtSize.LARGE} value={t("hanab", "Hanab")} />
        </div>
        <span className="tc lavender">{t("tagline", "Play the Hanab game online with friends!")}</span>
        <main className="flex flex-column mt5">
          <Button
            primary
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
          <Button
            className="mb4"
            id="tutorial"
            size={ButtonSize.LARGE}
            onClick={() => {
              router.push("/learn").catch(logFailedPromise);
            }}
          >
            {t("learnHanab", "Learn")}
            <Txt className="ml2" size={TxtSize.XXSMALL}>
              {t("learnHanabTime", "~5 mn")}
            </Txt>
          </Button>

          <span
            className="flex flex-column items-center link white pointer mt4"
            onClick={() => {
              rulesRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>{t("whatsHanab", "What's Hanab?")}</span>
            <span>⌄</span>
          </span>
        </main>
      </div>
      <div ref={rulesRef}>
        <Rules />
      </div>
      <div ref={fireworksRef} className="fixed absolute--fill z-999" style={{ pointerEvents: "none" }} />
    </div>
  );
}
