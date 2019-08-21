import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";

import { DatabaseProvider, setupDatabase } from "../context/database";

import "../styles/tachyons.css";
import "../styles/style.css";

export default class Hanabi extends App {
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
            href="https://fonts.googleapis.com/css?family=Kalam&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            href="../static/favicon.ico"
            type="image/x-icon"
          />
          <title>Hanabi</title>
        </Head>
        <Container>
          <DatabaseProvider value={this.database}>
            <div className="aspect-ratio--object">
              <Component {...pageProps} />
            </div>
          </DatabaseProvider>
        </Container>
      </>
    );
  }
}
