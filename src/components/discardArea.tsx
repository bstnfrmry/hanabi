import classnames from "classnames";
import { chunk, groupBy, sortBy } from "lodash";
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
    return (
      <div className="w-50 mw6">
        <CardWrapper className="mr1" color={color} size={CardSize.SMALL} />
      </div>
    );
  }

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex w-50 mw6">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          className={classnames("mr1", { nl2: i > 0 })}
          context={ICardContext.DISCARDED}
          size={CardSize.SMALL}
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

  const rows = chunk(getColors(game), 2);

  return (
    <div className="relative flex flex-column flex-grow-1">
      <div className="flex flex-column w-100">
        {rows.map((colors, i) => {
          return (
            <div key={i} className={classnames("w-100 flex", { mt2: i > 0 })}>
              {colors.map(color => {
                return (
                  <CardPile
                    key={color}
                    cards={byColor[color] || []}
                    color={color}
                  />
                );
              })}
            </div>
          );
        })}
        <a
          className="absolute right-0 top-0 mr2 mt2"
          onClick={() => onCloseArea()}
        >
          <Txt className="ml2" value="×" />
        </a>
      </div>
    </div>
  );
}
