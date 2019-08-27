import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Button, { IButtonSize } from "~/components/ui/button";
import Box from "~/components/ui/box";

export default function Home() {
  const router = useRouter();
  const [lastGame, setLastGame] = useState(null);

  useEffect(() => {
    if (localStorage.gameId && localStorage.playerId) {
      setLastGame({
        gameId: localStorage.gameId,
        playerId: localStorage.playerId
      });
    }
  }, []);

  return (
    <Box className="w-100 h-100 flex flex-row justify-center items-center bg-main-dark">
      <div className="flex flex-column items-center">
        <img className="mw4 mb4" src="/static/hanabi.png" />
        <h1 className="f2 ttu tracked outline-main-dark">Hanabi</h1>
      </div>
      <div className="flex flex-column ml5">
        <Button
          size={IButtonSize.LARGE}
          className="mb4"
          onClick={() => router.push("/new-game")}
        >
          Create a room
        </Button>
        <Button
          size={IButtonSize.LARGE}
          className="mb4"
          onClick={() => router.push("/join-game")}
        >
          Join a room
        </Button>
        {lastGame && (
          <Button
            size={IButtonSize.LARGE}
            onClick={() =>
              router.replace({
                pathname: "/play",
                query: lastGame
              })
            }
          >
            Rejoin game
          </Button>
        )}
      </div>
    </Box>
  );
}
