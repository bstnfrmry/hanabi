import { LinearGradient } from "expo";

import { Color } from "../game/state";
export const Colors = {
  White: "#f4f6f7",

  Gray: {
    Medium: "#a0aec0"
  },

  Red: {
    Medium: "#ec7063"
  },

  Green: {
    Medium: "#52be80"
  },

  Blue: {
    Medium: "#1824a2",
    Dark: "#001030"
  },

  Yellow: {
    Medium: "#f4d03f"
  },

  Multicolor: "#9f7aea" // TODO: conic gradient
};

export const ColorMap = {
  [Color.BLUE]: require("../../assets/images/cards/blue.png"),
  [Color.RED]: require("../../assets/images/cards/red.png"),
  [Color.YELLOW]: require("../../assets/images/cards/yellow.png"),
  [Color.WHITE]: require("../../assets/images/cards/white.png"),
  [Color.GREEN]: require("../../assets/images/cards/green.png"),
  [Color.MULTICOLOR]: require("../../assets/images/cards/multicolor.png")
};
