import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import DiscardPile from "./discardPile";

export default ({ game, onSimulateTurn }) => (
  <div className="flex flex-column pa2 pa4-l bg-gray-light">
    <PlayedCards cards={game.board} />
    <div className="flex flex-row mt2 mt4-l ph1 justify-left items-center">
      <TokenSpace
        noteTokens={game.remainingNoteTokens}
        stormTokens={game.remainingStormTokens}
      />
      <DrawPile cards={game.deck} />
      <DiscardPile cards={game.discardPile} />
      <button
        className="pa3 br1 ba f6 f4-l fw2 tracked ttu ml2 gray pointer"
        onClick={onSimulateTurn}
      >
        Simulate turn
      </button>
    </div>
  </div>
);
