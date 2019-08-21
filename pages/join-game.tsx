import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDatabase } from "../context/database";
import IGameState from "../game/state";
import Button from "../components/button";

export default function JoinGame() {
  const router = useRouter();
  const db = useDatabase();

  const [games, setGames] = useState({});

  useEffect(() => {
    // @todo this fetches all available games... we need a more efficient key strategy
    // we could have a store of game-statuses with creation date, status (lobby), etc.
    // and keep the game state purely about the game and cards
    db.ref(`/games`).once("value", event => {
      setGames(event.val());
    });
  });

  return (
    <div className="white">
      {Object.keys(games).map(k => {
        const game = games[k] as IGameState;
        // @todo we need to filter by date, like 'created in the last 10 min'
        if (
          !game.players ||
          !game.players.length ||
          +game.players.length >= +game.playersCount
        ) {
          return null;
        }

        if (game.status === "lobby") {
          return (
            <div className="pa2" key={k}>
              <Button onClick={() => router.push(`/play?gameId=${k}`)}>
                {game.players.map(p => p.name).join(", ")} -{" "}
                {game.players.length}/{game.playersCount}
              </Button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
