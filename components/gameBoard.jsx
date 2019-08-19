import React from "react";

import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";

export default function GameBoard({ game, onSelectDiscard, onSimulateTurn }) {
  const playedCards = game.playedCards || [];
  const discardPile = game.discardPile || [];
  console.log(game);
  return (
    <div className="flex flex-column pa2 pa4-l bg-gray-light">
      <PlayedCards cards={playedCards} />
      <div className="flex flex-row mt2 mt4-l ph1 justify-left items-center">
        <TokenSpace
          noteTokens={game.tokens.hints}
          stormTokens={game.tokens.strikes}
        />
        <DrawPile cards={game.drawPile} />
        <button
          className="pa3 br1 ba f6 f4-l fw2 tracked ttu ml2 gray pointer"
          onClick={onSelectDiscard}
        >
          Discard ({discardPile.length})
        </button>
        <button
          className="pa3 br1 ba f6 f4-l fw2 tracked ttu ml2 gray pointer"
          onClick={onSimulateTurn}
        >
          Simulate turn
        </button>
      </div>
    </div>
  );
}
