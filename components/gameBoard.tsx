import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import DrawPile from "./drawPile";
import Button from "./button";
import IGameState from "../game/state";
import {
  getScore,
  getMaximumScore,
  getMaximumPossibleScore
} from "../game/actions";

interface IGameBoard {
  game: IGameState;
  onSelectDiscard: Function;
  onRollback: Function;
}

export default function GameBoard({
  game,
  onSelectDiscard,
  onRollback
}: IGameBoard) {
  const playedCards = game.playedCards || [];
  const discardPile = game.discardPile || [];
  const history = game.history || [];

  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <div className="flex flex-column-l justify-between pa2 pa4-l bg-gray-light">
      <div className="flex flex-column">
        <PlayedCards
          cards={playedCards}
          multicolorOption={game.options.multicolor}
        />
        <div className="ma1 f5 f4-l">
          Score: {score} / {maxPossibleScore}
          {maxScore !== maxPossibleScore && (
            <span className="strike ml1 gray">{maxScore}</span>
          )}
        </div>
      </div>
      <div className="flex flex-row ph1 justify-left mt1 items-center-l">
        <TokenSpace
          noteTokens={game.tokens.hints}
          stormTokens={game.tokens.strikes}
        />
        <DrawPile cards={game.drawPile} />
        <Button onClick={onSelectDiscard}>
          Discard&nbsp;({discardPile.length})
        </Button>
        {game.options.allowRollback && (
          <Button disabled={!history.length} onClick={onRollback}>
            ⟲
          </Button>
        )}
      </div>
    </div>
  );
}
