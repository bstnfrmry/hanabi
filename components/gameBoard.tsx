import React from "react";

import { CardWrapper } from "~/components/card";
import HomeButton from "~/components/homeButton";
import PlayedCards from "~/components/playedCards";
import TokenSpace from "~/components/tokenSpace";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import { Eye } from "~/components/ui/icons";
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
  onShowRollback: Function;
}

export { CardWrapper } from "~/components/card";

export default function GameBoard(props: Props) {
  const { onSelectDiscard, onMenuClick, onShowRollback } = props;

  const game = useGame();
  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <div className="pa2 pa3-l shadow-5 bg-black-50">
      <div>
        <Txt
          uppercase
          id="score"
          value={`Score: ${score} / ${maxPossibleScore}`}
        />

        {maxScore !== maxPossibleScore && (
          <Txt uppercase className="strike ml1 gray" value={maxScore} />
        )}

        {game.actionsLeft > 0 &&
          game.actionsLeft <= game.options.playersCount && (
            <Txt
              uppercase
              className="red ml2"
              value={`· ${game.actionsLeft} turn${
                game.actionsLeft > 1 ? "s" : ""
              } left`}
            />
          )}
      </div>
      <div className="flex flex-wrap items-end">
        <div className="flex flex-column mb3">
          <PlayedCards cards={game.playedCards} />
        </div>
        <div className="flex flex-row ph1 mt3 justify-left items-end">
          <div className="mr2 relative flex flex-column items-center">
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
            {game.drawPile.length <= 5 ? (
              <Txt
                className="red ml2 mt1"
                value={
                  game.drawPile.length === 0
                    ? "no card left"
                    : `${game.drawPile.length} card${
                        game.drawPile.length > 1 ? "s" : ""
                      } left`
                }
              />
            ) : (
              <Txt className="gray mt1" value="deck" />
            )}
          </div>
          <div
            className="pointer relative mr3 tc flex flex-column items-center"
            onClick={() => onSelectDiscard()}
          >
            <Tutorial placement="below" step={ITutorialStep.DISCARD_PILE}>
              <CardWrapper color="light-silver relative flex flex-column">
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
                        style={{ marginTop: `-2px` }}
                        value={i + 1}
                      />
                      <div
                        className="w-40 h-40 self-end"
                        style={{ fill: "lightgray", marginBottom: "-5px" }}
                      >
                        <Eye />
                      </div>
                    </CardWrapper>
                  </div>
                ))}
              </CardWrapper>
              <Txt className="gray mt1" value="discard" />
            </Tutorial>
          </div>
          <div className="mr2 mr3-l tc">
            <TokenSpace
              hints={game.tokens.hints}
              strikes={game.tokens.strikes}
            />
            <Txt className="gray mt1" value="tokens" />
          </div>

          <div className="flex flex absolute top-0 right-0 mt2 mr2">
            {game.options.allowRollback && (
              <Button
                void
                disabled={!game.history.length}
                size={ButtonSize.TINY}
                text="⟲"
                onClick={() => onShowRollback()}
              />
            )}
            <HomeButton void className="ml1" onClick={onMenuClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
