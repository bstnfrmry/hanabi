import { groupBy, last } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { getColors } from "~/game/actions";
import { ICard } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  cards: ICard[];
}

export default function PlayedCards(props: Props) {
  const { cards } = props;

  const game = useGame();
  const groupedCards = groupBy(cards, c => c.color);
  const colors = getColors(game);

  return (
    <Tutorial step={ITutorialStep.PLAYED_CARDS} placement="below">
      <div className="flex flex-row mt1">
        {colors.map((color, i) => {
          const topCard = last(groupedCards[color]);

          if (!topCard) {
            return (
              <CardWrapper
                key={i}
                size={CardSize.MEDIUM}
                className="mr1"
                color={color}
              />
            );
          }
          return (
            <CardWrapper
              key={i}
              size={CardSize.MEDIUM}
              className="mr1 relative"
              color={color}
            >
              {groupedCards[color].map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  context={ICardContext.PLAYED}
                  size={CardSize.MEDIUM}
                  className="absolute"
                  style={{
                    top: `-${i * 2}px`
                  }}
                />
              ))}
            </CardWrapper>
          );
        })}
      </div>
    </Tutorial>
  );
}
