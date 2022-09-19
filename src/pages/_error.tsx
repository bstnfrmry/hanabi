import Router from "next/router";
import React from "react";
import { Trans, Translation } from "react-i18next";
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
        <Translation>
          {(t) => (
            <>
              <Txt className="red" size={TxtSize.LARGE} value={statusCode} />
              <Txt className="mb4" value={t("apologies", "We're sorry, something went wrong 😕")} />

              <Txt className="mv4 tc lh-copy">
                <Trans i18nKey="errorWillInvestigate">
                  We'll investigate as soon as possible. Don't hesitate to{" "}
                  <a className="lavender" href="mailto:bastien.formery+hanab@gmail.com">
                    reach out
                  </a>
                  to let us know what happened.
                </Trans>{" "}
                {t("earlyDevelopment", "The game is still in early development and we'd love your feedback.")}
                <br />
                <br />
                <Trans i18nKey="publicRepo">
                  We also have
                  <a
                    className="lavender"
                    href="https://github.com/bstnfrmry/hanabi/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    a public Github repository{" "}
                  </a>
                  if you'd like to contribute or report a bug.
                </Trans>
              </Txt>

              <Button text={t("backMenu", "Back to menu")} onClick={() => Router.replace("/")} />
            </>
          )}
        </Translation>
      </div>
    );
  }
}
