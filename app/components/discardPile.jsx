import React from "react";
import { sortBy } from "lodash";

import Card, { CardWrapper } from "./card";

function CardPile({ cards, color }) {
  if (!cards.length) {
    return <CardWrapper color={color} size="large" className="ma1" />;
  }

  const sortedCards = sortBy(cards, card => card.value);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          size="large"
          className="ma1"
          style={i ? { marginTop: "-25px" } : {}}
        />
      ))}
    </div>
  );
}

export default function DiscardPile({ cards }) {
  const piles = Object.keys(cards);

  return (
    <div className="flex">
      {piles.map((color, i) => (
        <CardPile key={i} cards={cards[color]} color={color} />
      ))}
    </div>
  );
}
