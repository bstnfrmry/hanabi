import React from "react";
import Head from "next/head";

import App from "../components/app";
import "../styles/tachyons.css";
import "../styles/style.css";

export default function Home({ gameId, seed }) {
  Home.getInitialProps = ({ query }) => {
    return {
      seed: query.seed,
      gameId: query.gameId
    };
  };

  return (
    <>
      <Head>
        <title>Hanabi</title>
      </Head>
      <div className="aspect-ratio--object">
        <App gameId={gameId} seed={seed} />
      </div>
    </>
  );
}
