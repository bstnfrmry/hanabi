import "../styles/style.css";

import NextApp, { Container } from "next/app";
import Head from "next/head";
import React from "react";

import Txt, { TxtSize } from "~/components/ui/txt";
import useConnectivity from "~/hooks/connectivity";
import FirebaseNetwork, { setupFirebase } from "~/hooks/firebase";
import { NetworkContext } from "~/hooks/network";

export default class App extends NextApp {
  render() {
    return <Hanabi Component={this.props.Component} />;
  }
}

function Hanabi(props: any) {
  const { Component } = props;

  const online = useConnectivity();
  const network = new FirebaseNetwork(setupFirebase());

  return (
    <>
      <Head>
        <link
          href="/static/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link href="/static/hanabi-192.png" rel="apple-touch-icon" />

        <link href="/static/manifest.json" rel="manifest" />
        <link href="/static/hanabi-192.png" rel="apple-touch-icon" />

        <title>Hanabi</title>
        <meta content="#00153f" name="theme-color" />
        <meta content="Play the hanabi card game online." name="Description" />
      </Head>
      <Container>
        <NetworkContext.Provider value={network}>
          <div className="aspect-ratio--object">
            {/* Offline indicator */}
            {!online && (
              <Txt
                uppercase
                className="z-999 flex justify-center items-center bg-red shadow-4 b--red ba pa2"
                size={TxtSize.MEDIUM}
                value="You are offline"
              />
            )}

            <Component />
          </div>
        </NetworkContext.Provider>
      </Container>
    </>
  );
}
