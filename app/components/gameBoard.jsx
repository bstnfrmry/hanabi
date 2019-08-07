import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import DiscardPile from "./discardPile";

export default ({ game, onSimulateTurn }) => (
  <div className="flex flex-column pt4 ph4 bb bg-gray-light b--gray-light">
    <PlayedCards cards={game.board} />
    <div className="flex flex-row mv4 ph1 justify-between items-center">
      <TokenSpace
        noteTokens={game.remainingNoteTokens}
        stormTokens={game.remainingStormTokens}
      />
      <div>
        <DrawPile cards={game.deck} />
        <DiscardPile cards={game.discardPile} />
        <button
          className="pa3 br1 ba f4 fw2 tracked ttu ml2 gray pointer"
          onClick={onSimulateTurn}
        >
          Simulate turn
        </button>
      </div>
    </div>
  </div>
);
