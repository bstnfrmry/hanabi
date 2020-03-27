import "../styles/style.css";

import * as Sentry from "@sentry/browser";
import NextApp, { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import React, { ErrorInfo, useState } from "react";

import Txt, { TxtSize } from "~/components/ui/txt";
import useConnectivity from "~/hooks/connectivity";
import FirebaseNetwork, { setupFirebase } from "~/hooks/firebase";
import { NetworkContext } from "~/hooks/network";

import { initGA, logPageView } from "../lib/analytics";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

Router.events.on("routeChangeComplete", () => logPageView());

export default class App extends NextApp {
  componentDidMount() {
    initGA();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  render() {
    return <Hanabi {...this.props} />;
  }
}

function Hanabi(props: AppProps) {
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
    </>
  );
}
