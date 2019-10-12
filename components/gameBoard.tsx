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
      </div>
      <div className="relative flex flex-wrap items-end">
        <div className="flex flex-column">
          <div className="flex items-center h2 nt2">
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
            <Txt className="gray" value="tokens" />
          </div>

          <div className="flex flex absolute top-0 right-0">
            {game.options.allowRollback && (
              <Button
                disabled={!game.history.length}
                size={ButtonSize.TINY}
                text="⟲"
                onClick={() => onShowRollback()}
              />
            )}
            <HomeButton className="ml1" onClick={onMenuClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

const Eye = () => (
  <svg
    enableBackground="new -0.709 -32.081 141.732 141.732"
    version="1.1"
    viewBox="-0.709 -32.081 141.732 141.732"
  >
    <path d="M89.668,38.786c0-10.773-8.731-19.512-19.51-19.512S50.646,28.01,50.646,38.786c0,10.774,8.732,19.511,19.512,19.511   C80.934,58.297,89.668,49.561,89.668,38.786 M128.352,38.727c-13.315,17.599-34.426,28.972-58.193,28.972   c-23.77,0-44.879-11.373-58.194-28.972C25.279,21.129,46.389,9.756,70.158,9.756C93.927,9.756,115.036,21.129,128.352,38.727    M140.314,38.76C125.666,15.478,99.725,0,70.158,0S14.648,15.478,0,38.76c14.648,23.312,40.591,38.81,70.158,38.81   S125.666,62.072,140.314,38.76" />
  </svg>
);
