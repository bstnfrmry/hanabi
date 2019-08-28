import React from "react";

import { useGame } from "../hooks/game";
import {
  getScore,
  getMaximumScore,
  getMaximumPossibleScore
} from "../game/actions";

import Button, { IButtonSize } from "./ui/button";
import Box from "~/components/ui/box";
import HomeButton from "~/components/homeButton";
import PlayedCards from "~/components/playedCards";
import TokenSpace from "~/components/tokenSpace";
import { CardWrapper } from "~/components/card";

interface Props {
  onSelectDiscard: Function;
  onRollback: Function;
}

export default function GameBoard(props: Props) {
  const { onSelectDiscard, onRollback } = props;

  const game = useGame();
  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <Box className="mb1" borderColor="yellow-light">
      <div className="flex justify-between flex-column-l items-end items-start-l">
        <div className="flex flex-column mb5-l">
          <div className="f7 f3-l ttu">
            Score: {score} / {maxPossibleScore}
            {maxScore !== maxPossibleScore && (
              <span className="strike ml1 gray">{maxScore}</span>
            )}
            {game.drawPile.length < 5 && (
              <div className="ml1 inline-flex">
                ·
                <span className="yellow ml2">
                  {game.drawPile.length} cards left
                </span>
              </div>
            )}
            {game.actionsLeft <= game.options.playersCount && (
              <div className="ml1 inline-flex">
                ·<span className="red ml2">{game.actionsLeft} turns left</span>
              </div>
            )}
          </div>
          <div className="flex flex-column mt1">
            <PlayedCards cards={game.playedCards} />
          </div>
        </div>
        <div className="flex flex-row ph1 justify-left items-end">
          <div className="mr2 relative">
            <CardWrapper color="main">
              {game.drawPile.map((card, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: `-${i / 2}px` }}
                >
                  <CardWrapper key={card.id} color="main">
                    {i + 1}
                  </CardWrapper>
                </div>
              ))}
            </CardWrapper>
          </div>
          <div
            className="pointer relative mr3"
            onClick={() => onSelectDiscard()}
          >
            <CardWrapper color="light-silver relative">
              {game.discardPile.map((card, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: `-${i / 2}px` }}
                >
                  <CardWrapper key={card.id} color="light-silver">
                    <div className="absolute pointer">{i + 1}</div>
                  </CardWrapper>
                </div>
              ))}
              <div
                className={`absolute w-100 o-50 rotate-135 bg-white b--white`}
                style={{ height: "2px" }}
              />
            </CardWrapper>
          </div>
          <div className="mr3">
            <TokenSpace
              hints={game.tokens.hints}
              strikes={game.tokens.strikes}
            />
          </div>

          <div className="flex flex-column absolute-l top-1 right-1">
            <HomeButton className="mb1" />
            {game.options.allowRollback && (
              <Button
                size={IButtonSize.TINY}
                disabled={!game.history.length}
                onClick={onRollback}
              >
                ⟲
              </Button>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}
