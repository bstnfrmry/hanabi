import React from "react";
import App, { Container } from "next/app";

import { DatabaseProvider, setupDatabase } from "../context/database";

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
      <Container>
        <DatabaseProvider value={this.database}>
          <Component {...pageProps} />
        </DatabaseProvider>
      </Container>
    );
  }
}
