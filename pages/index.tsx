import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Rules from "~/components/rules";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";

export default function Home() {
  const router = useRouter();
  const [lastGame, setLastGame] = useState(null);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (localStorage.gameId && localStorage.playerId) {
      setLastGame({
        gameId: localStorage.gameId,
        playerId: localStorage.playerId
      });
    }
  }, []);

  return (
    <div className="w-100 h-100 flex flex-column justify-center items-center bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <div className="flex flex-column items-center">
        <img alt="logo" className="mw4 mb4" src="/static/hanabi.png" />
        <Txt size={TxtSize.LARGE} value="Hanabi" />
      </div>
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
          id="offline"
          size={ButtonSize.LARGE}
          text="Pass and play"
          onClick={() => router.push("/new-game?offline=1")}
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
                query: lastGame
              })
            }
          />
        )}
        <span className="tc pointer" onClick={() => setShowRules(true)}>
          What's Hanabi?
        </span>
        {showRules && <Rules setShowRules={setShowRules} />}
      </div>
    </div>
  );
}
