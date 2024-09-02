import * as Sentry from "@sentry/react";
import { AppProps } from "next/app";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import Txt, { TxtSize } from "~/components/ui/txt";
import useConnectivity from "~/hooks/connectivity";
import { initAnalytics, logPageView } from "~/lib/analytics";
import { i18n } from "~/lib/i18n";
import "../styles/style.css";
import { logFailedPromise } from "~/lib/errors";
import { TutorialProvider } from "~/components/tutorial";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
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

export default function App(props: AppProps) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <Sentry.ErrorBoundary>
      <Hanab {...props} />;
    </Sentry.ErrorBoundary>
  );
}

function Hanab({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    i18n.changeLanguage(router.locale).catch(logFailedPromise);
  }, [router.locale]);

  const [showOffline, setShowOffline] = useState(true);
  const online = useConnectivity();

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <TutorialProvider>
          <Meta />

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
        </TutorialProvider>
      </I18nextProvider>
    </>
  );
}

function Meta() {
  const { t } = useTranslation();

  const tagline = `${t("tagline")} · ${t("subTagline")}`;
  const title = `${t("hanab")} · ${t("tagline")}`;
  return (
    <Head>
      <title>{title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap'); @import
        url('https://fonts.googleapis.com/css2?family=Kalam&display=swap');
      </style>
      <link href="/static/favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <link href="/static/hanab-192.png" rel="apple-touch-icon" />
      <link href="/static/manifest.json" rel="manifest" />
      <meta content={tagline} name="Description" />

      <meta content="hanab.cards" property="og:title" />
      <meta content={tagline} property="og:description" />
      <meta content="https://hanab.cards/static/hanab-192.png" property="og:image" />
      <meta content="https://hanab.cards" property="og:url" />

      <meta content="hanab.cards" name="twitter:title" />
      <meta content={tagline} name="twitter:description" />
      <meta content="https://hanab.cards/static/hanab-192.png" name="twitter:image" />
      <meta content="summary_large_image" name="twitter:card" />

      <meta content="#00153f" name="theme-color" />
    </Head>
  );
}
