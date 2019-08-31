import "../styles/tachyons.css";
import "../styles/style.css";
import "../styles/fonts.css";
import "../styles/animations.css";
import "../styles/patterns.css";
import "../styles/popover.css";

import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";

import FirebaseNetwork, { setupFirebase } from "~/hooks/firebase";
import { Network, NetworkContext } from "~/hooks/network";

export default class Hanabi extends App {
  network: Network;

  constructor(props) {
    super(props);

    this.network = new FirebaseNetwork(setupFirebase());
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
            href="/static/favicon.ico"
            rel="shortcut icon"
            type="image/x-icon"
          />
          <link href="/static/manifest.json" rel="manifest" />
          <title>Hanabi</title>
        </Head>
        <Container>
          <NetworkContext.Provider value={this.network}>
            <div className="aspect-ratio--object">
              <Component {...pageProps} />
            </div>
          </NetworkContext.Provider>
        </Container>
      </>
    );
  }
}
