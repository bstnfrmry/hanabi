import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import DiscardPile from "./discardPile";

export default ({ game }) => (
  <div className="w-100 bg-moon-gray pa2 flex flex-column">
    <PlayedCards cards={game.board} />
    <div className="flex flex-row pv1">
      <TokenSpace
        noteTokens={game.remainingNoteTokens}
        stormTokens={game.remainingStormTokens}
      />
      <DrawPile cards={game.deck} />
      <DiscardPile cards={game.discardPile} />
    </div>
  </div>
);
