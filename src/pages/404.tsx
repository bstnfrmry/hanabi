import Router from "next/router";
import React from "react";
import { Translation } from "react-i18next";

import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";

interface Props {
  statusCode: number;
}

export default class Error extends React.Component<Props> {
  render() {
    return (
      <div className="pa2 pv4-l ph3-l shadow-5 br3 bg-main-dark flex flex-column justify-center items-center w-100 h-100">
        <Translation>
          {t => (
            <>
              <Txt className="orange" size={TxtSize.LARGE} value={404} />
              <Txt className="mb4" value={t("pageNotFound", "Page not found")} />

              <Button text={t("backMenu", "Back to menu")} onClick={() => Router.replace("/")} />
            </>
          )}
        </Translation>
      </div>
    );
  }
}
