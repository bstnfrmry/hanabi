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

const gradient = color => {
  `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="url(#paint0_linear)"/>
    <defs>
    <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
    <stop stop-color="${color}"/>
    <stop offset="0.5" stop-color="${Colors.Gray.Medium}"/>
    <stop offset="1" stop-color="${color}"/>
    </linearGradient>
    </defs>
  </svg>`;
};

export const ColorMap = {
  [Color.BLUE]: require("../../assets/images/cards/blue.png"),
  [Color.RED]: require("../../assets/images/cards/red.png"),
  [Color.YELLOW]: require("../../assets/images/cards/yellow.png"),
  [Color.WHITE]: require("../../assets/images/cards/white.png"),
  [Color.GREEN]: require("../../assets/images/cards/green.png"),
  [Color.MULTICOLOR]: require("../../assets/images/cards/multicolor.png")
};
