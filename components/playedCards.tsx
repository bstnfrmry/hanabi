import React from "react";
import { last, groupBy } from "lodash";

import { ICard } from "~/game/state";
import { getColors } from "~/game/actions";
import { useGame } from "~/hooks/game";

import Card, { CardWrapper, ICardContext, ICardSize } from "~/components/card";

interface Props {
  cards: ICard[];
}

export default function PlayedCards(props: Props) {
  const { cards } = props;

  const game = useGame();
  const groupedCards = groupBy(cards, c => c.color);
  const colors = getColors(game);

  return (
    <div className="flex flex-row">
      {colors.map((color, i) => {
        const topCard = last(groupedCards[color]);

        if (!topCard) {
          return (
            <CardWrapper
              key={i}
              size={ICardSize.MEDIUM}
              className="ma1"
              color={color}
            />
          );
        }
        return (
          <CardWrapper
            size={ICardSize.MEDIUM}
            className="ma1 relative"
            color={color}
          >
            {groupedCards[color].map((card, i) => (
              <Card
                card={card}
                context={ICardContext.PLAYED}
                size={ICardSize.MEDIUM}
                className="absolute"
                style={{
                  top: `-${i * 2}px`,
                  left: `${i}px`
                }}
              />
            ))}
          </CardWrapper>
        );
      })}
    </div>
  );
}
