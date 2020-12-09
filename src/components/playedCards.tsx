import { groupBy, last } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { useGame } from "~/hooks/game";
import { getColors } from "~/lib/actions";
import { ICard } from "~/lib/state";

interface Props {
  cards: ICard[];
}

export default function PlayedCards(props: Props) {
  const { cards } = props;

  const game = useGame();
  const groupedCards = groupBy(cards, c => c.color);
  const colors = getColors(game?.options?.variant);

  return (
    <Tutorial placement="below" step={ITutorialStep.PLAYED_CARDS}>
      <div className="flex flex-row mt1">
        {colors.map((color, i) => {
          const topCard = last(groupedCards[color]);

          if (!topCard) {
            return <CardWrapper key={i} className="mr1" color={color} size={CardSize.MEDIUM} />;
          }
          return (
            <CardWrapper key={i} className="mr1 relative" color={color} size={CardSize.MEDIUM}>
              {groupedCards[color].map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  className="absolute"
                  context={ICardContext.PLAYED}
                  size={CardSize.MEDIUM}
                  style={{
                    top: `-${i * 2}px`,
                  }}
                />
              ))}
            </CardWrapper>
          );
        })}
      </div>
    </Tutorial>
  );
}
