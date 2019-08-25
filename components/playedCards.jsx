import React from "react";
import { last, groupBy } from "lodash";

import { getColors } from "../game/actions";
import Card, { CardWrapper } from "./card";

export default ({ game, cards }) => {
  const groupedCards = groupBy(cards, c => c.color);
  const colors = getColors(game);

  return (
    <div className="flex flex-row">
      {colors.map((color, i) => {
        const topCard = last(groupedCards[color]);

        if (!topCard) {
          return (
            <CardWrapper key={i} size="medium" className="ma1" color={color} />
          );
        }
        return (
          <CardWrapper size="medium" className="ma1 relative" color={color}>
            {groupedCards[color].map((card, i) => (
              <Card
                card={card}
                color={color}
                size="medium"
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
};
