import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Game } from "~/components/game";
import useConnectivity from "~/hooks/connectivity";
import { GameContext } from "~/hooks/game";
import { loadUserPreferences, UserPreferencesContext } from "~/hooks/userPreferences";
import { subscribeToGame } from "~/lib/firebase";
import IGameState from "~/lib/state";

function SsrFreeGameIndex(props: { host: string; game: IGameState }) {
  const { game: initialGame, host } = props;
  const [userPreferences, setUserPreferences] = useState(loadUserPreferences());
  const [game, setGame] = useState<IGameState>(initialGame);
  const online = useConnectivity();
  const router = useRouter();
  /**
   * Load game from database
   */
  useEffect(() => {
    if (!online) return;

    return subscribeToGame(game.id as string, (game) => {
      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [online, game.id, router]);

  return (
    <GameContext.Provider value={game}>
      <UserPreferencesContext.Provider value={[userPreferences, setUserPreferences]}>
        <Game host={host} onGameChange={setGame} />
      </UserPreferencesContext.Provider>
    </GameContext.Provider>
  );
}

const GameIndex = dynamic(() => Promise.resolve(SsrFreeGameIndex), {
  ssr: false,
});
export default GameIndex;
