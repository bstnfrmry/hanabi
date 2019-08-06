import React from "react";
import Head from "next/head";
import App from "../components/app";

export default function Home({ seed }) {
  Home.getInitialProps = ({ query }) => {
    return { seed: query.seed }
  }
  
  return <>
    <Head>
      <title>Hanabi</title>
      <link
        rel="stylesheet"
        href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"
      />
    </Head>
    <div className="aspect-ratio--object">
      <App seed={seed} />
    </div>
  </>
}

