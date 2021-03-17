import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Game } from "~/components/game";
import { TutorialProvider } from "~/components/tutorial";
import useConnectivity from "~/hooks/connectivity";
import { GameContext } from "~/hooks/game";
import { ReplayContext } from "~/hooks/replay";
import { Session, SessionContext } from "~/hooks/session";
import { loadGame, subscribeToGame } from "~/lib/firebase";
import withSession, { getPlayerIdFromSession } from "~/lib/session";
import IGameState from "~/lib/state";

export const getServerSideProps = withSession(async function({ req, params }) {
  const game = await loadGame(params.gameId);
  const playerId = await getPlayerIdFromSession(req);

  const protocol = process.env.NODE_ENV === "development" ? "http:" : "https:";
  const { host } = req.headers;

  return {
    props: {
      session: {
        playerId,
      },
      game,
      host: `${protocol}//${host}`,
    },
  };
});

interface Props {
  game: IGameState;
  session: Session;
  host: string;
}

export default function Play(props: Props) {
  const { game: initialGame, session, host } = props;

  const online = useConnectivity();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(initialGame);
  const [replayCursor, setReplayCursor] = useState<number>(null);

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!online) return;

    return subscribeToGame(game.id as string, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [online, game.id]);

  return (
    <TutorialProvider>
      <GameContext.Provider value={game}>
        <SessionContext.Provider value={session}>
          <ReplayContext.Provider value={{ cursor: replayCursor, moveCursor: setReplayCursor }}>
            <Game host={host} onGameChange={setGame} />
          </ReplayContext.Provider>
        </SessionContext.Provider>
      </GameContext.Provider>
    </TutorialProvider>
  );
}
