import React from "react";
import Head from "next/head";
import App from "../components/app";

const Home = () => (
  <>
    <Head>
      <title>Hanabi</title>
      <link
        rel="stylesheet"
        href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"
      />
    </Head>
    <div className="aspect-ratio--object">
      <App />
    </div>
  </>
);

export default Home;
