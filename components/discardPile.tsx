import React from "react";
import { groupBy, sortBy } from "lodash";
import classnames from "classnames";

import { ICard, IColor } from "~/game/state";
import { getColors } from "~/game/actions";
import { useGame } from "~/hooks/game";

import Card, { CardWrapper, ICardContext, ICardSize } from "~/components/card";

interface CardPileProps {
  cards: ICard[];
  color: IColor;
}

function CardPile(props: CardPileProps) {
  const { cards, color } = props;

  if (!cards.length) {
    return (
      <CardWrapper color={color} size={ICardSize.MEDIUM} className="ma1" />
    );
  }

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          context={ICardContext.DISCARDED}
          size={ICardSize.MEDIUM}
          className={classnames("ma1", { "nt3 nt4-l": i > 0 })}
        />
      ))}
    </div>
  );
}

interface Props {
  cards: ICard[];
}

export default function DiscardPile(props: Props) {
  const { cards } = props;

  const game = useGame();
  const byColor = groupBy(
    sortBy(cards, card => card.number),
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
