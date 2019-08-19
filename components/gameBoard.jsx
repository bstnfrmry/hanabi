import React from "react";
import { sumBy } from "lodash";

import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";

export default function GameBoard({ game, onSelectDiscard }) {
  const playedCards = game.playedCards || [];
  const discardPile = game.discardPile || [];

  const score = playedCards.length;
  const maxScore = game.options.multicolor ? 30 : 25;

  return (
    <div className="flex flex-column pa2 pa4-l bg-gray-light">
      <div className="flex flex-column">
        <div className="self-end">
          <PlayedCards cards={playedCards} />
        </div>
        <div className="self-end mt1">
          Score: {score} / {maxScore}
        </div>
      </div>
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
      </div>
    </div>
  );
}
