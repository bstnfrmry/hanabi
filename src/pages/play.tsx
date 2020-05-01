import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Game } from "~/components/game";
import LoadingScreen from "~/components/loadingScreen";
import { TutorialProvider } from "~/components/tutorial";
import useConnectivity from "~/hooks/connectivity";
import { GameContext } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import { ReplayContext } from "~/hooks/replay";
import IGameState from "~/lib/state";

export default function Play() {
  const network = useNetwork();
  const online = useConnectivity();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(null);
  const [replayCursor, setReplayCursor] = useState<number>(null);

  const { gameId } = router.query;

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!online) return;

    if (!gameId) {
      return;
    }

    return network.subscribeToGame(gameId as string, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [gameId, online]);

  if (!game) {
    return <LoadingScreen />;
  }

  return (
    <TutorialProvider>
      <GameContext.Provider value={game}>
        <ReplayContext.Provider value={{ cursor: replayCursor, moveCursor: setReplayCursor }}>
          <Game onGameChange={setGame} />
        </ReplayContext.Provider>
      </GameContext.Provider>
    </TutorialProvider>
  );
}
