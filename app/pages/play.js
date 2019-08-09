import React from "react";
import Head from "next/head";

import App from "../components/app";
import "../styles/tachyons.css";
import "../styles/style.css";

export default function Player({ gameId, playerId }) {
  Player.getInitialProps = ({ query }) => {
    return {
      playerId: query.playerId,
      gameId: query.gameId
    };
  };

  return (
    <>
      <Head>
        <title>Hanabi</title>
      </Head>
      <div className="aspect-ratio--object">
        <App gameId={gameId} playerId={playerId} />
      </div>
    </>
  );
}
