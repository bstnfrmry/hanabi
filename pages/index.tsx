import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Button from "~/components/ui/button";

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
    <div className="w-100 h-100 flex flex-column justify-center items-center">
      <Button className="ma2" onClick={() => router.push("/new-game")}>
        Create a room
      </Button>
      <Button className="ma2" onClick={() => router.push("/join-game")}>
        Join a room
      </Button>
      {lastGame && (
        <Button
          className="ma2"
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
  );
}
