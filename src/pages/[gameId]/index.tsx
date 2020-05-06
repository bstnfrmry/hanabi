import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Game } from "~/components/game";
import { TutorialProvider } from "~/components/tutorial";
import useConnectivity from "~/hooks/connectivity";
import FirebaseNetwork, { setupFirebase } from "~/hooks/firebase";
import { GameContext } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import { ReplayContext } from "~/hooks/replay";
import { Session, SessionContext } from "~/hooks/session";
import { uniqueId } from "~/lib/id";
import withSession from "~/lib/session";
import IGameState from "~/lib/state";

export const getServerSideProps = withSession(async function({ req, params }) {
  const firebase = new FirebaseNetwork(setupFirebase());
  const game = await firebase.loadGame(params.gameId);

  const playerId = req.session.get("playerId");
  if (playerId === undefined) {
    req.session.set("playerId", uniqueId());
  }

  await req.session.save();

  return {
    props: {
      session: {
        playerId: req.session.get("playerId"),
      },
      game,
      host: "http://localhost:4000",
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

  const network = useNetwork();
  const online = useConnectivity();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(initialGame);
  const [replayCursor, setReplayCursor] = useState<number>(null);

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!online) return;

    return network.subscribeToGame(game.id, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [online]);

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
