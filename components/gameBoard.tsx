import React from "react";
import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import Button from "./button";
import IGameState from "../game/state";
import {
  getScore,
  getMaximumScore,
  getMaximumPossibleScore
} from "../game/actions";
import { CardWrapper } from "./card";

interface IGameBoard {
  game: IGameState;
  onSelectDiscard: Function;
  onMenuClick: Function;
  onLogsClick: Function;
  onRollback: Function;
}

export default function GameBoard({
  game,
  onSelectDiscard,
  onMenuClick,
  onLogsClick,
  onRollback
}: IGameBoard) {
  const playedCards = game.playedCards || [];
  const history = game.history || [];

  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <div className="pa2 pa3-l bg-temple pa2 shadow-5 br2">
      <div className="f6 f4-l ttu">
        Score: {score} / {maxPossibleScore}
        {maxScore !== maxPossibleScore && (
          <span className="strike ml1 gray">{maxScore}</span>
        )}
        {game.actionsLeft <= game.options.playersCount && (
          <div className="ml2 inline-flex">
            ·<span className="red ml2">{game.actionsLeft} turns left</span>
          </div>
        )}
      </div>
      <div className="flex flex-column-l justify-between mt1">
        <div className="flex flex-column">
          <PlayedCards
            cards={playedCards}
            multicolorOption={game.options.multicolor}
          />
        </div>
        <div className="flex flex-row ph1 justify-left mt1 items-center">
          <TokenSpace
            noteTokens={game.tokens.hints}
            stormTokens={game.tokens.strikes}
          />
          <div className="mr2">
            <CardWrapper color="light-silver">
              {game.drawPile.length}
            </CardWrapper>
          </div>
          <div className="pointer" onClick={() => onSelectDiscard()}>
            <CardWrapper color="light-silver">
              {game.discardPile.length}
            </CardWrapper>
          </div>
          <div className="flex ml2">
            {game.options.allowRollback && (
              <Button disabled={!history.length} onClick={onRollback}>
                ⟲
              </Button>
            )}
            <Button onClick={onLogsClick}>?</Button>
            <Button onClick={onMenuClick}>☰</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
