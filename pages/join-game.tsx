import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import IGameState, { fillEmptyValues } from "~/game/state";
import { useDatabase } from "~/hooks/database";

import Button, { IButtonSize } from "~/components/ui/button";
import Box from "~/components/ui/box";
import LoadingScreen from "~/components/loadingScreen";
import HomeButton from "~/components/homeButton";

export default function JoinGame() {
  const router = useRouter();
  const db = useDatabase();

  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<IGameState[]>([]);

  useEffect(() => {
    db.ref(`/games`)
      .orderByChild("status")
      .equalTo("lobby")
      .on("value", event => {
        const games = Object.values(event.val() || {})
          .map(fillEmptyValues)
          // At least one player in the room
          .filter(game => game.players.length)
          // There are slots remaining
          .filter(game => +game.players.length < +game.playersCount)
          // The game is recent
          .filter(game => game.createdAt > Date.now() - 10 * 60 * 1000);

        setLoading(false);
        setGames([...games, ...games, ...games, ...games]);
      });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box className="w-100 h-100 flex justify-center items-center overflow-y-scroll relative">
      <HomeButton className="absolute top-1 right-1" />
      <div className="w-50 h-100">
        {!games.length && (
          <>
            <h1 className="ttu">No available room</h1>
            <Button
              size={IButtonSize.LARGE}
              className="ma2"
              onClick={() => router.push("/new-game")}
            >
              Create a room
            </Button>
          </>
        )}
        {games.length > 0 && (
          <>
            <h1 className="ttu">Available rooms</h1>
            {games.map(game => (
              <div className="mb3" key={game.id}>
                <Button
                  className="w-100 flex justify-center"
                  onClick={() => router.push(`/play?gameId=${game.id}`)}
                >
                  <span className="flex-grow-1">
                    {game.players.map(p => p.name).join(", ")}
                  </span>
                  <span>
                    {game.players.length}/{game.playersCount}
                  </span>
                </Button>
              </div>
            ))}
          </>
        )}
      </div>
    </Box>
  );
}
