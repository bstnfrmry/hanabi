import classnames from "classnames";
import { sortBy } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import { ICard, IColor } from "~/game/state";

interface Props {
  cards: ICard[];
  color: IColor;
}

export default function CardStack(props: Props) {
  const { cards, color } = props;

  if (!cards.length) {
    return <CardWrapper className="ma1" color={color} size={CardSize.MEDIUM} />;
  }

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          className={classnames("ma1", { "nt3 nt4-l": i > 0 })}
          context={ICardContext.DISCARDED}
          size={CardSize.MEDIUM}
        />
      ))}
    </div>
  );
}
