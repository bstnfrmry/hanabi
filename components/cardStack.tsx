import React from "react";
import { sortBy } from "lodash";
import classnames from "classnames";

import { ICard, IColor } from "~/game/state";

import Card, { CardWrapper, ICardContext, CardSize } from "~/components/card";

interface Props {
  cards: ICard[];
  color: IColor;
}

export default function CardStack(props: Props) {
  const { cards, color } = props;

  if (!cards.length) {
    return <CardWrapper color={color} size={CardSize.MEDIUM} className="ma1" />;
  }

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          context={ICardContext.DISCARDED}
          size={CardSize.MEDIUM}
          className={classnames("ma1", { "nt3 nt4-l": i > 0 })}
        />
      ))}
    </div>
  );
}
