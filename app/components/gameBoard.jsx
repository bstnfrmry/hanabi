import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import DiscardPile from "./discardPile";

export default () => (
  <div className="w-100 bg-blue flex-grow-1 pa2 flex flex-column">
    <PlayedCards />
    <div className="flex flex-row">
      <TokenSpace />
      <DrawPile />
      <DiscardPile />
    </div>
  </div>
);
