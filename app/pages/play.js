import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import App from "../components/app";
import "../styles/tachyons.css";
import "../styles/style.css";

export default function Player() {
  const router = useRouter();
  const { gameId, playerId } = router.query;

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
