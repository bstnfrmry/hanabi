import React from "react";
import { last, groupBy, sortBy } from "lodash";
import { colors } from "../game/actions";

import Card, { CardWrapper } from "./card";

export default ({ cards, multicolorOption }) => {
  const groupedCards = groupBy(cards, c => c.color);

  return (
    <div className="flex flex-row">
      {colors
        .filter(c => (multicolorOption ? true : c !== "multicolor"))
        .map((color, i) => {
          const topCard = last(groupedCards[color]);

          if (!topCard) {
            return (
              <CardWrapper
                key={i}
                size="medium"
                className="ma1"
                color={color}
              />
            );
          }

          return (
            <Card
              key={color}
              card={topCard}
              color={color}
              size="medium"
              className="ma1"
            />
          );
        })}
    </div>
  );
};
