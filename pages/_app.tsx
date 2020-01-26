import "../styles/style.css";

import NextApp, { Container } from "next/app";
import Head from "next/head";
import React, { useState } from "react";

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

  const [showOffline, setShowOffline] = useState(true);
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
            {!online && showOffline && (
              <div className="relative flex items-center justify-center bg-red shadow-4 b--red ba pa2 z-99">
                <Txt uppercase size={TxtSize.MEDIUM} value="You are offline" />
                <a
                  className="absolute right-1"
                  onClick={() => setShowOffline(false)}
                >
                  <Txt value="×" />
                </a>
              </div>
            )}

            <Component />
          </div>
        </NetworkContext.Provider>
      </Container>
    </>
  );
}
