import React from "react";

import PlayedCards from "./playedCards";
import TokenSpace from "./tokenSpace";
import Button from "./ui/button";
import {
  getScore,
  getMaximumScore,
  getMaximumPossibleScore
} from "../game/actions";
import { CardWrapper } from "./card";
import { useGame } from "../hooks/game";
import Box from "~/components/ui/box";

interface Props {
  onSelectDiscard: Function;
  onMenuClick: Function;
  onRollback: Function;
}

export default function GameBoard(props: Props) {
  const { onSelectDiscard, onMenuClick, onRollback } = props;

  const game = useGame();
  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <Box className="mb1">
      <div className="flex justify-between items-end">
        <div className="flex flex-column">
          <div className="f7 f4-l ttu">
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
            <CardWrapper color="light-silver">
              {game.drawPile.map((card, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: `-${i / 2}px` }}
                >
                  <CardWrapper key={card.id} color="light-silver">
                    {i + 1}
                  </CardWrapper>
                </div>
              ))}
            </CardWrapper>
          </div>
          <div
            className="pointer relative mr2"
            onClick={() => onSelectDiscard()}
          >
            <CardWrapper color="light-silver">
              {game.discardPile.map((card, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: `-${i / 2}px` }}
                >
                  <CardWrapper key={card.id} color="light-silver">
                    <div className="absolute white o-50 pointer">{i + 1}</div>
                    <div
                      className={`absolute w-100 o-80 rotate-135 bg-white b--white`}
                      style={{ height: "2px" }}
                    />
                  </CardWrapper>
                </div>
              ))}
            </CardWrapper>
          </div>
          <TokenSpace hints={game.tokens.hints} strikes={game.tokens.strikes} />

          <div className="flex flex-column">
            <Button onClick={onMenuClick} className="mb1">
              ☰
            </Button>
            {game.options.allowRollback && (
              <Button disabled={!history.length} onClick={onRollback}>
                ⟲
              </Button>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}
