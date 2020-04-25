import classnames from "classnames";
import { chunk, groupBy, sortBy } from "lodash";
import React from "react";

import Card, { CardSize, ICardContext } from "~/components/card";
import Txt from "~/components/ui/txt";
import { getColors } from "~/game/actions";
import { ICard, IColor } from "~/game/state";
import { useGame } from "~/hooks/game";

interface CardPileProps {
  cards: ICard[];
  color: IColor;
}

function CardPile(props: CardPileProps) {
  const { cards } = props;

  const sortedCards = sortBy(cards, card => card.number);

  return (
    <div className="flex mw">
      {sortedCards.map((card, i) => (
        <Card
          key={i}
          card={card}
          className={classnames("mr1", { nl2: i > 0 })}
          context={ICardContext.DISCARDED}
          size={CardSize.TINY}
        />
      ))}
    </div>
  );
}

export default function DiscardArea() {
  const game = useGame();

  const byColor = groupBy(
    sortBy(game.discardPile, card => card.number),
    card => card.color
  );

  const rows = chunk(getColors(game), 2);

  return (
    <div className="relative pl1">
      <Txt
        className="flex justify-end gray mr1"
        value={`discard (${game.discardPile.length})`}
      />
      {rows.map((colors, i) => {
        return (
          <div key={i} className={"flex justify-end mt1"}>
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
    </div>
  );
}
