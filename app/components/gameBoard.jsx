import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import DiscardPile from "./discardPile";

export default () => (
  <div className="w-100 bg-moon-gray pa2 flex flex-column">
    <PlayedCards />
    <div className="flex flex-row pv1">
      <TokenSpace />
      <DrawPile />
      <DiscardPile />
    </div>
  </div>
);
