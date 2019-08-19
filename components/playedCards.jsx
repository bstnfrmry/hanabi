import React from "react";
import { last, groupBy, sortBy } from "lodash";

import Card, { CardWrapper } from "./card";

const piles = ["red", "yellow", "green", "blue", "white"];

export default ({ cards }) => {
  const groupedCards = groupBy(cards, c => c.color);

  return (
    <div className="flex flex-row">
      {piles.map((color, i) => {
        const topCard = last(groupedCards[color]);

        if (!topCard) {
          return (
            <CardWrapper key={i} size="large" className="ma1" color={color} />
          );
        }

        return (
          <Card
            key={i}
            card={topCard}
            color={color}
            size="large"
            className="ma1"
          />
        );
      })}
    </div>
  );
};
