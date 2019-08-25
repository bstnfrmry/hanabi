import React from "react";
import { groupBy, sortBy } from "lodash";
import classnames from "classnames";

import Card, { CardWrapper } from "./card";
import { getColors } from "../game/actions";

function CardPile({ cards, color }) {
  if (!cards.length) {
    return <CardWrapper color={color} size="medium" className="ma1" />;
  }

  const sortedCards = sortBy(cards, card => card.value);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          size="medium"
          className={classnames("ma1", { "nt3 nt4-l": i > 0 })}
        />
      ))}
    </div>
  );
}

export default function DiscardPile({ cards }) {
  const game = useGame();
  const byColor = groupBy(
    sortBy(cards, card => card.value),
    card => card.color
  );

  return (
    <div className="flex w-100">
      {getColors(game).map((color, i) => (
        <CardPile key={i} cards={byColor[color] || []} color={color} />
      ))}
    </div>
  );
}
