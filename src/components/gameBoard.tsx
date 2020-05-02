import React from "react";

import { CardWrapper } from "~/components/card";
import HomeButton from "~/components/homeButton";
import PlayedCards from "~/components/playedCards";
import TokenSpace from "~/components/tokenSpace";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import { getMaximumPossibleScore, getMaximumScore, getScore } from "~/lib/actions";
import { IGameStatus } from "~/lib/state";

interface Props {
  onMenuClick?: Function;
  onRollbackClick?: Function;
}

export { CardWrapper } from "~/components/card";

export default function GameBoard(props: Props) {
  const { onMenuClick, onRollbackClick } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Txt uppercase id="score" value={`Hanabi • Score: ${score} / ${maxPossibleScore}`} />

          {maxScore !== maxPossibleScore && <Txt uppercase className="strike ml1 gray" value={maxScore} />}

          {game.actionsLeft > 0 && game.actionsLeft <= game.options.playersCount && (
            <Txt
              uppercase
              className="red ml2"
              value={`· ${game.actionsLeft} turn${game.actionsLeft > 1 ? "s" : ""} left`}
            />
          )}
        </div>
        <div className="flex">
          {game.options.allowRollback && selfPlayer && onRollbackClick && (
            <Button
              void
              disabled={game.status === IGameStatus.LOBBY}
              size={ButtonSize.TINY}
              text="⟲"
              onClick={() => onRollbackClick()}
            />
          )}
          {onMenuClick && <HomeButton void className="ml1" onClick={onMenuClick} />}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between">
        <div className="flex flex-column mb3">
          <PlayedCards cards={game.playedCards} />
        </div>
        <div className="flex flex-row mt2 justify-right items-end ml2">
          <div className="mr2 relative flex flex-column items-center">
            <CardWrapper color={game.drawPile.length > 5 ? "main" : "strikes"}>
              {game.drawPile.map((card, i) => (
                <div key={i} className="absolute" style={{ top: `-${i / 2}px` }}>
                  <CardWrapper key={card.id} color={game.drawPile.length > 5 ? "main" : "strikes"}>
                    <Txt className="outline-main-dark" size={TxtSize.MEDIUM} value={i + 1} />
                  </CardWrapper>
                </div>
              ))}
            </CardWrapper>
            {game.drawPile.length <= 5 ? (
              <Txt className="red mt1" value={`${game.drawPile.length} left`} />
            ) : (
              <Txt className="gray mt1" value="deck" />
            )}
          </div>
          <div className="tc">
            <TokenSpace hints={game.tokens.hints} strikes={game.tokens.strikes} />
            <Txt className="gray mt1" value="tokens" />
          </div>
        </div>
      </div>
    </div>
  );
}
