import classnames from "classnames";
import { chunk, groupBy, sortBy } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";

import Card, { CardSize, ICardContext } from "~/components/card";
import Txt from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { getColors } from "~/lib/actions";
import { ICard, IColor } from "~/lib/state";

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
          size={CardSize.XSMALL}
        />
      ))}
    </div>
  );
}

export default function DiscardArea() {
  const game = useGame();
  const { t } = useTranslation();

  const byColor = groupBy(
    sortBy(game.discardPile, card => card.number),
    card => card.color
  );

  const rows = chunk(getColors(game.options.variant), 2);

  return (
    <div className="relative pl1">
      <Txt className="flex justify-end gray mr1" value={t("discardPile", { discardLength: game.discardPile.length })} />
      {rows.map((colors, i) => {
        return (
          <div key={i} className={"flex justify-end mt1"}>
            {colors.map(color => {
              return <CardPile key={color} cards={byColor[color] || []} color={color} />;
            })}
          </div>
        );
      })}
    </div>
  );
}
