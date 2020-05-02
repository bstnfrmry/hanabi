import * as Sentry from "@sentry/browser";
import SentryFullStory from "@sentry/fullstory";
import NextApp, { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React, { ErrorInfo, useState } from "react";
import FullStory from "react-fullstory";
import { I18nextProvider, useTranslation } from "react-i18next";

import Txt, { TxtSize } from "~/components/ui/txt";
import useConnectivity from "~/hooks/connectivity";
import FirebaseNetwork, { setupFirebase } from "~/hooks/firebase";
import { NetworkContext } from "~/hooks/network";
import { i18n } from "~/lib/i18n";

import { initGA, logPageView } from "../lib/analytics";
import "../styles/style.css";

const FS_ORG_ID = "T0W6G";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new SentryFullStory("https://sentry.io/organizations/bstnfrmry")],
});

Router.events.on("routeChangeComplete", () => logPageView());

let nprogressTimeout: NodeJS.Timeout = null;

Router.events.on("routeChangeStart", () => {
  nprogressTimeout = setTimeout(() => NProgress.start(), 200);
});

Router.events.on("routeChangeComplete", () => {
  clearTimeout(nprogressTimeout);
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  clearTimeout(nprogressTimeout);
  NProgress.done();
});

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
  const { Component, pageProps } = props;
  const { t } = useTranslation();

  const [showOffline, setShowOffline] = useState(true);
  const online = useConnectivity();
  const network = new FirebaseNetwork(setupFirebase());

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <Head>
          <link href="/static/favicon.ico" rel="shortcut icon" type="image/x-icon" />
          <link href="/static/hanabi-192.png" rel="apple-touch-icon" />

          <link href="/static/manifest.json" rel="manifest" />
          <link href="/static/hanabi-192.png" rel="apple-touch-icon" />

          <title>Hanabi</title>
          <meta content="#00153f" name="theme-color" />
          <meta content={t("tagline")} name="Description" />
        </Head>
        <FullStory org={FS_ORG_ID} />

        <NetworkContext.Provider value={network}>
          <div className="aspect-ratio--object">
            {/* Offline indicator */}
            {!online && showOffline && (
              <div className="relative flex items-center justify-center bg-red shadow-4 b--red ba pa2 z-99">
                <Txt uppercase size={TxtSize.MEDIUM} value={t("offline")} />
                <a className="absolute right-1" onClick={() => setShowOffline(false)}>
                  <Txt value="×" />
                </a>
              </div>
            )}

            <Component {...pageProps} />
          </div>
        </NetworkContext.Provider>
      </I18nextProvider>
    </>
  );
}
