import React from "react";
import { sumBy } from "lodash";

import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";

export default function GameBoard({ game, onSelectDiscard, onSimulateTurn }) {
  const discardPiles = Object.keys(game.discardPile);
  const discardedCardsCount = sumBy(
    discardPiles,
    color => game.discardPile[color].length
  );

  return (
    <div className="flex flex-column pa2 pa4-l bg-gray-light">
      <PlayedCards cards={game.board} />
      <div className="flex flex-row mt2 mt4-l ph1 justify-left items-center">
        <TokenSpace
          noteTokens={game.remainingNoteTokens}
          stormTokens={game.remainingStormTokens}
        />
        <DrawPile cards={game.deck} />
        <button
          className="pa3 br1 ba f6 f4-l fw2 tracked ttu ml2 gray pointer"
          onClick={onSelectDiscard}
        >
          Discard ({discardedCardsCount})
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
