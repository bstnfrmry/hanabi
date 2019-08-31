import classnames from "classnames";
import { groupBy, sortBy } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import Txt, { TxtSize } from "~/components/ui/txt";
import { getColors } from "~/game/actions";
import { ICard, IColor } from "~/game/state";
import { useGame } from "~/hooks/game";

interface CardPileProps {
  cards: ICard[];
  color: IColor;
}

function CardPile(props: CardPileProps) {
  const { cards, color } = props;

  if (!cards.length) {
    return <CardWrapper className="mr1" color={color} size={CardSize.MEDIUM} />;
  }

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex flex-column">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          className={classnames("mr1", { "nt2 nt4-l": i > 0 })}
          context={ICardContext.DISCARDED}
          size={CardSize.MEDIUM}
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
      <div className="flex flex-row pb1 pb2-l ttu ml1 mb2">
        <a onClick={() => onCloseArea()}>
          <Txt uppercase size={TxtSize.MEDIUM} value="Discarded cards" />
          <Txt className="ml2" value="×" />
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
