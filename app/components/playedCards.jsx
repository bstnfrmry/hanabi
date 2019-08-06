import React from "react";
import { last } from "lodash";

import Card, { CardWrapper } from "./card";

export default ({ cards }) => {
  const piles = Object.keys(cards)

  return <div className="flex flex-row">
    {piles.map((color, i) => {
      const topCard = last(cards[color])

      if (!topCard) {
        return <CardWrapper
          key={i}
          size="large"
          className="ma1"
          color={color}
        />
      }

      return <Card
        key={i}
        card={last(cards[color])}
        color={color}
        size="large"
        className='ma1'
      />
    })}
  </div>
};
