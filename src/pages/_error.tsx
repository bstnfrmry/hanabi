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

        <Txt className="mv4 tc lh-copy">
          We'll investigate as soon as possible. Don't hesitate to{" "}
          <a className="lavender" href="mailto:bastien.formery@gmail.com">
            reach out
          </a>{" "}
          to let us know what happened.
          <br />
          The game is still in early development and we'd love your feedback.
          <br />
          <br />
          We also have a{" "}
          <a className="lavender" href="https://github.com/bstnfrmry/hanabi/" rel="noopener noreferrer" target="_blank">
            public Github repository
          </a>{" "}
          if you'd like to contribute or report a bug.
        </Txt>

        <Button text="Back to menu" onClick={() => Router.replace("/")} />
      </div>
    );
  }
}
