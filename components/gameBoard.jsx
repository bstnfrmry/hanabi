import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import Button from "./button";

export default function GameBoard({ game, onSelectDiscard }) {
  const playedCards = game.playedCards || [];
  const discardPile = game.discardPile || [];

  const score = playedCards.length;
  const maxScore = game.options.multicolor ? 30 : 25;

  return (
    <div className="flex flex-column-l justify-between pa2 pa4-l bg-gray-light">
      <div className="flex flex-column">
        <PlayedCards cards={playedCards} />
        <div className="ma1 f5 f4-l">
          Score: {score} / {maxScore}
        </div>
      </div>
      <div className="flex flex-row ph1 justify-left mt1 items-center-l">
        <TokenSpace
          noteTokens={game.tokens.hints}
          stormTokens={game.tokens.strikes}
        />
        <DrawPile cards={game.drawPile} />
        <Button
          className="pa3 br1 ba f7 f5-l fw2 tracked ttu ml2 gray pointer"
          onClick={onSelectDiscard}
        >
          Discard ({discardPile.length})
        </Button>
      </div>
    </div>
  );
}
