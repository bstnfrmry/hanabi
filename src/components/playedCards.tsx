import classnames from "classnames";
import { groupBy, last } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { useGame } from "~/hooks/game";
import { getPilesColors } from "~/lib/actions";
import { ICard, IColor } from "~/lib/state";

interface Props {
  cards: ICard[];
  pendingTargetColor: boolean;
  onPileClick: (color: IColor) => void;
}

export default function PlayedCards(props: Props) {
  const { cards, pendingTargetColor, onPileClick } = props;

  const game = useGame();
  const groupedCards = groupBy(cards, c => c.asColor || c.color);
  const colors = getPilesColors(game);

  return (
    <Tutorial placement="below" step={ITutorialStep.PLAYED_CARDS}>
      <div className="flex flex-row mt1">
        {colors.map((color, i) => {
          const topCard = last(groupedCards[color]);

          if (!topCard) {
            return (
              <CardWrapper
                key={i}
                className={classnames("mr1", {
                  pointer: pendingTargetColor,
                })}
                color={color}
                size={CardSize.MEDIUM}
                onClick={() => onPileClick(color)}
              />
            );
          }
          return (
            <CardWrapper
              key={i}
              className={classnames("mr1 relative", {
                pointer: pendingTargetColor,
              })}
              color={color}
              size={CardSize.MEDIUM}
            >
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
                  onClick={() => onPileClick(color)}
                />
              ))}
            </CardWrapper>
          );
        })}
      </div>
    </Tutorial>
  );
}
