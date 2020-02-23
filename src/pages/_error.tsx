import Router from "next/router";
import React from "react";

import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";

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
      <div className="pa2 pv4-l ph3-l shadow-5 br3 bg-main-dark flex flex-column justify-center items-center w-100 h-100">
        <Txt className="red" size={TxtSize.LARGE} value={statusCode} />
        <Txt className="mb4" value="We're sorry, something went wrong 😕" />
        <Button text="Back to menu" onClick={() => Router.replace("/")} />
      </div>
    );
  }
}
