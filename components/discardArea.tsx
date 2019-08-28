import React from "react";
import classnames from "classnames";
import { groupBy, sortBy } from "lodash";

import { ICard, IColor } from "~/game/state";
import { getColors } from "~/game/actions";
import { useGame } from "~/hooks/game";

import Card, { CardWrapper, ICardContext, CardSize } from "~/components/card";

interface CardPileProps {
  cards: ICard[];
  color: IColor;
}

function CardPile(props: CardPileProps) {
  const { cards, color } = props;

  if (!cards.length) {
    return <CardWrapper color={color} size={CardSize.LARGE} className="ma1" />;
  }

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          context={ICardContext.DISCARDED}
          size={CardSize.LARGE}
          className={classnames("ma1", { "nt2 nt3-l": i > 0 })}
        />
      ))}
    </div>
  );
}

interface Props {
  onCloseArea: Function;
}

export default function DiscardArea(props: Props) {
  const { onCloseArea } = props;

  const game = useGame();

  const byColor = groupBy(
    sortBy(game.discardPile, card => card.number),
    card => card.color
  );

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f7 f3-l fw2 ttu ml1 mb2">
        <a onClick={() => onCloseArea()}>
          Discarded cards
          <span className="ml2">&times;</span>
        </a>
      </div>
      <div className="flex w-100">
        {getColors(game).map((color, i) => (
          <CardPile key={i} cards={byColor[color] || []} color={color} />
        ))}
      </div>
    </div>
  );
}
