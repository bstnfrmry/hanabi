import "../styles/tachyons.css";
import "../styles/style.css";
import "../styles/fonts.css";
import "../styles/animations.css";
import "../styles/patterns.css";

import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";

import { DatabaseContext, setupDatabase } from "~/hooks/database";

export default class Hanabi extends App {
  database: firebase.database.Database;

  constructor(props) {
    super(props);

    this.database = setupDatabase();
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <link
            rel="shortcut icon"
            href="/static/favicon.ico"
            type="image/x-icon"
          />
          <link rel="manifest" href="/static/manifest.json" />
          <title>Hanabi</title>
        </Head>
        <Container>
          <DatabaseContext.Provider value={this.database}>
            <div className="aspect-ratio--object">
              <Component {...pageProps} />
            </div>
          </DatabaseContext.Provider>
        </Container>
      </>
    );
  }
}
