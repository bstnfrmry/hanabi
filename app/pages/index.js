import React from "react";
import Head from "next/head";

import App from "../components/app";
import "../styles/tachyons.css"
import "../styles/style.css"

export default function Home({ seed }) {
  Home.getInitialProps = ({ query }) => {
    return { seed: query.seed }
  }
  
  return <>
    <Head>
      <title>Hanabi</title>
    </Head>
    <div className="aspect-ratio--object">
      <App seed={seed} />
    </div>
  </>
}

