import { groupBy, last } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";
import { getPilesColors } from "~/lib/actions";
import { ICard, IColor } from "~/lib/state";

interface Props {
  cards: ICard[];
  onPlaceCard: (color: IColor) => void;
}

export default function PlayedCards(props: Props) {
  const { cards, onPlaceCard } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const groupedCards = groupBy(cards, c => c.asColor || c.color);
  const colors = getPilesColors(game);

  const lastPlayedCard = last(game.playedCards);

  return (
    <Tutorial placement="below" step={ITutorialStep.PLAYED_CARDS}>
      <div className="flex flex-row mt1">
        {colors.map((color, i) => {
          const topCard = last(groupedCards[color]);

          const element = !topCard ? (
            <CardWrapper className="mr1" color={color} size={CardSize.MEDIUM} />
          ) : (
            <CardWrapper className="mr1 relative" color={color} size={CardSize.MEDIUM}>
              {groupedCards[color].map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  className="absolute"
                  context={ICardContext.PLAYED}
                  size={CardSize.MEDIUM}
                  style={{
                    top: `-${i * 2}px`,
                  }}
                />
              ))}
            </CardWrapper>
          );

          const canPlayHere = topCard ? lastPlayedCard?.number === topCard?.number + 1 : lastPlayedCard?.number === 1;

          return (
            <div key={i} className="flex flex-column items-center">
              {element}
              {selfPlayer === currentPlayer && selfPlayer?.pendingAction && canPlayHere && (
                <Button
                  primary
                  className="mt1 mr1"
                  size={ButtonSize.TINY}
                  text="ˆ"
                  onClick={() => onPlaceCard(color)}
                />
              )}
            </div>
          );
        })}
      </div>
    </Tutorial>
  );
}
