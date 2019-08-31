import React from "react";
import Router from "next/router";

import Box from "~/components/ui/box";
import Button from "~/components/ui/button";

interface Props {
  statusCode: number;
}

export default class Error extends React.Component<Props> {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;

    return (
      <Box className="bg-main-dark flex flex-column justify-center items-center w-100 h-100">
        <h1 className="f1 red">{statusCode}</h1>
        <p className="mb4">We&apos;re sorry, something went wrong 😕</p>
        <Button onClick={() => Router.replace("/")} text="Back to menu" />
      </Box>
    );
  }
}
