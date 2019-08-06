import React from "react";
import { last } from "lodash";
import Card from "./card";

export default ({ cards }) => {
  const piles = Object.keys(cards)

  return <div className="flex flex-row">
    {piles.map((color, i) => (
      <Card
        key={i}
        card={last(cards[color])}
        color={color}
        size="large"
        className='ma1'
      />
    ))}
  </div>
};
