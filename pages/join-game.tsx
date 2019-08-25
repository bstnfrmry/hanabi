import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import IGameState, { fillEmptyValues } from "~/game/state";
import { useDatabase } from "~/hooks/database";

import Button from "~/components/ui/button";
import Box from "~/components/ui/box";

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
        setGames(games);
      });
  }, []);

  return (
    <div className="w-100 h-100 flex justify-center items-center">
      <Box className="w-50">
        {loading && <h1>Loading...</h1>}

        {!loading && (
          <>
            {!games.length && (
              <div>
                <h1>No available room</h1>
                <Button
                  className="ma2"
                  onClick={() => router.push("/new-game")}
                >
                  Create a room
                </Button>
              </div>
            )}

            {games.length > 0 && (
              <>
                <h1>Available rooms</h1>
                {games.map(game => (
                  <div className="mb3" key={game.id}>
                    <Button
                      onClick={() => router.push(`/play?gameId=${game.id}`)}
                    >
                      {game.players.map(p => p.name).join(", ")} -{" "}
                      {game.players.length}/{game.playersCount}
                    </Button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Box>
    </div>
  );
}
