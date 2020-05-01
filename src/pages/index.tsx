import { useRouter } from "next/router";
import React, { useRef } from "react";

import Rules from "~/components/rules";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import useLocalStorage from "~/hooks/localStorage";

export default function Home() {
  const router = useRouter();
  const [gameId] = useLocalStorage("gameId", null);
  const [playerId] = useLocalStorage("playerId", null);
  const rulesRef = useRef<HTMLDivElement>();

  const lastGame = gameId && playerId ? { gameId } : null;

  return (
    <div className="w-100 overflow-y-scroll flex flex-column justify-center items-center bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <div className="vh-100 flex flex-column items-center justify-center">
        <div className="flex flex-column items-center">
          <img alt="Hanabi cards game online logo" className="mw4 mb4" src="/static/hanabi.png" />
          <Txt size={TxtSize.LARGE} value="Hanabi" />
        </div>
        <span className="tc lavender">Play the Hanabi game online with friends!</span>
        <div className="flex flex-column mt5">
          <Button
            className="mb4"
            id="create-room"
            size={ButtonSize.LARGE}
            text="Create a room"
            onClick={() => router.push("/new-game")}
          />
          <Button
            className="mb4"
            id="join-room"
            size={ButtonSize.LARGE}
            text="Join a room"
            onClick={() => router.push("/join-game")}
          />
          {lastGame && (
            <Button
              className="mb4"
              id="rejoin-game"
              size={ButtonSize.LARGE}
              text="Rejoin game"
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
            <span>What's Hanabi?</span>
            <span>⌄</span>
          </span>
        </div>
      </div>
      <div ref={rulesRef}>
        <Rules />
      </div>
    </div>
  );
}
