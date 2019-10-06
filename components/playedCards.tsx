import classnames from "classnames";
import { groupBy, last } from "lodash";
import React from "react";

import Card, { CardSize, CardWrapper, ICardContext } from "~/components/card";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { getColors } from "~/game/actions";
import { ICard } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  cards: ICard[];
}

export default function PlayedCards(props: Props) {
  const { cards } = props;

  const game = useGame();
  const groupedCards = groupBy(cards, c => c.color);
  const colors = getColors(game);

  return (
    <Tutorial placement="below" step={ITutorialStep.PLAYED_CARDS}>
      <div className="flex flex-row mt1">
        {colors.map((color, i) => {
          const topCard = last(groupedCards[color]);

          if (!topCard) {
            return (
              <CardWrapper
                key={i}
                className="mr1"
                color={color}
                size={CardSize.MEDIUM}
              />
            );
          }
          return (
            <CardWrapper
              key={i}
              className={classnames("relative", {
                "mr1 mr2-l": i < colors.length - 1
              })}
              color={color}
              size={CardSize.MEDIUM}
            >
              {groupedCards[color].map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  className="absolute"
                  context={ICardContext.PLAYED}
                  size={CardSize.MEDIUM}
                  style={{
                    top: `-${i * 2}px`
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
