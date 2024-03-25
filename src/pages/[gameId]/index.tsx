import React, { useState } from "react";
import NoSSR from "~/components/NoSSR";
import { TutorialProvider } from "~/components/tutorial";
import { ReplayContext } from "~/hooks/replay";
import { Session, SessionContext } from "~/hooks/session";
import { loadGame } from "~/lib/firebase";
import withSession, { getPlayerIdFromSession } from "~/lib/session";
import IGameState from "~/lib/state";
import GameIndex from "~/pages/[gameId]/ssrFreeGame";

export const getServerSideProps = withSession(async function ({ req, params }) {
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

  const [replayCursor, setReplayCursor] = useState<number>(null);

  return (
    // eslint-disable-next-line react/jsx-no-undef
    <TutorialProvider>
      <SessionContext.Provider value={session}>
        <ReplayContext.Provider value={{ cursor: replayCursor, moveCursor: setReplayCursor }}>
          <NoSSR>
            <GameIndex game={initialGame} host={host}></GameIndex>
          </NoSSR>
        </ReplayContext.Provider>
      </SessionContext.Provider>
    </TutorialProvider>
  );
}
