import * as Sentry from "@sentry/browser";
import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import React from "react";

process.on("unhandledRejection", err => {
  Sentry.captureException(err);
});

process.on("uncaughtException", err => {
  Sentry.captureException(err);
});

class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const lang = this.props.__NEXT_DATA__?.props?.pageProps?.lang ?? "en";

    return (
      <Html lang={lang}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
