import * as Sentry from "@sentry/browser";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

process.on("unhandledRejection", err => {
  Sentry.captureException(err);
});

process.on("uncaughtException", err => {
  Sentry.captureException(err);
});

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <div
            id="fireworksOverlay"
            style={{
              position: "absolute",
              zIndex: 100,
              width: "95%",
              height: "100%",
              margin: "0 auto",
              pointerEvents: "none"
            }}
          />
        </body>
      </Html>
    );
  }
}

export default Document;
