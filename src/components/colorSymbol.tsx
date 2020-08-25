import React from "react";

import { IColor } from "~/lib/state";

export const ColorsToSymbols = {
  [IColor.RED]: require("~/images/symbols/heart.svg"),
  [IColor.GREEN]: require("~/images/symbols/clove.svg"),
  [IColor.BLUE]: require("~/images/symbols/spade.svg"),
  [IColor.WHITE]: require("~/images/symbols/diamond.svg"),
  [IColor.YELLOW]: require("~/images/symbols/star.svg"),
  [IColor.ORANGE]: require("~/images/symbols/cloud.svg"),
  [IColor.MULTICOLOR]: require("~/images/symbols/wheel.svg"),
  [IColor.RAINBOW]: require("~/images/symbols/rainbow.svg"),
};

interface Props {
  color: IColor;
}

export default function ColorSymbol(props: Props) {
  const { color } = props;

  const svg = ColorsToSymbols[color];

  if (!svg) {
    return null;
  }

  return (
    <div className="absolute w-100 h-100 flex justify-center items-center">
      <img className="w-100 h-100" src={svg} style={{ transform: "scale(1.4)" }} />
    </div>
  );
}
