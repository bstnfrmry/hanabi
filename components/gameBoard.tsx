import React from "react";

import { CardWrapper } from "~/components/card";
import HomeButton from "~/components/homeButton";
import PlayedCards from "~/components/playedCards";
import TokenSpace from "~/components/tokenSpace";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import {
  getMaximumPossibleScore,
  getMaximumScore,
  getScore
} from "~/game/actions";
import { useGame } from "~/hooks/game";

interface Props {
  onSelectDiscard: Function;
  onMenuClick: Function;
  onRollback: Function;
}

export { CardWrapper } from "~/components/card";

export default function GameBoard(props: Props) {
  const { onSelectDiscard, onMenuClick, onRollback } = props;

  const game = useGame();
  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <div className="pa2 pv4-l ph3-l shadow-5 br3 mb1 ba b--yellow-light">
      <div className="flex justify-between flex-column-l items-end items-start-l">
        <div className="flex flex-column mb5-l">
          <div className="flex items-center h2 nt2">
            <Txt
              uppercase
              id="score"
              value={`Score: ${score} / ${maxPossibleScore}`}
            />

            {maxScore !== maxPossibleScore && (
              <Txt uppercase className="strike ml1 gray" value={maxScore} />
            )}

            {game.drawPile.length > 0 && game.drawPile.length < 5 && (
              <div className="ml2 flex items-center">
                ·
                <Txt
                  uppercase
                  className="yellow ml2"
                  value={`${game.drawPile.length} card${
                    game.drawPile.length > 1 ? "s" : ""
                  } left`}
                />
              </div>
            )}

            {game.actionsLeft > 0 &&
              game.actionsLeft <= game.options.playersCount && (
                <div className="ml2 flex items-center">
                  ·
                  <Txt
                    uppercase
                    className="red ml2"
                    value={`${game.actionsLeft} turn${
                      game.actionsLeft > 1 ? "s" : ""
                    } left`}
                  />
                </div>
              )}
          </div>
          <div className="flex flex-column mt1">
            <PlayedCards cards={game.playedCards} />
          </div>
        </div>
        <div className="flex flex-row ph1 justify-left items-end">
          <div className="mr2 relative">
            <CardWrapper color={game.drawPile.length > 5 ? "main" : "strikes"}>
              {game.drawPile.map((card, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: `-${i / 2}px` }}
                >
                  <CardWrapper
                    key={card.id}
                    color={game.drawPile.length > 5 ? "main" : "strikes"}
                  >
                    <Txt
                      className="outline-main-dark"
                      size={TxtSize.MEDIUM}
                      value={i + 1}
                    />
                  </CardWrapper>
                </div>
              ))}
            </CardWrapper>
          </div>
          <div
            className="pointer relative mr3"
            onClick={() => onSelectDiscard()}
          >
            <Tutorial placement="left" step={ITutorialStep.DISCARD_PILE}>
              <CardWrapper color="light-silver relative">
                {game.discardPile.map((card, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{ top: `-${i / 2}px` }}
                  >
                    <CardWrapper key={card.id} color="light-silver">
                      <Txt
                        className="absolute pointer"
                        size={TxtSize.MEDIUM}
                        value={i + 1}
                      />
                    </CardWrapper>
                  </div>
                ))}
              </CardWrapper>
            </Tutorial>
          </div>
          <div className="mr2 mr3-l">
            <TokenSpace
              hints={game.tokens.hints}
              strikes={game.tokens.strikes}
            />
          </div>

          <div className="flex flex-column absolute-l top-1 right-1">
            <HomeButton className="mb1" onClick={onMenuClick} />
            {game.options.allowRollback && (
              <Button
                disabled={!game.history.length}
                size={ButtonSize.TINY}
                text="⟲"
                onClick={() => onRollback()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
