import { useState } from "react";

import { useSelfPlayer, useCurrentPlayer } from "~/hooks/game";

import Button from "~/components/button";
import Card, { ICardContext, PositionMap, ICardSize } from "~/components/card";

interface Props {
  onCommitAction: Function;
  cardIndex?: number;
}

export default function SelfPlayerArea(props: Props) {
  const { onCommitAction, cardIndex } = props;

  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [selectedCard, selectCard] = useState<number>(cardIndex);

  const hasSelectedCard = selectedCard !== null;

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2">
        Your game
      </div>
      <div className="flex flex-row pb2">
        {selfPlayer.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            hidden={selfPlayer === currentPlayer}
            position={i}
            size={ICardSize.LARGE}
            context={ICardContext.TARGETED_PLAYER}
            className="ma1"
            onClick={() => selectCard(i)}
            selected={selectedCard === i}
          />
        ))}
      </div>
      {selfPlayer === currentPlayer && (
        <>
          <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2 mt3">
            {hasSelectedCard && <>Card {PositionMap[selectedCard]} selected</>}
            {!hasSelectedCard && "Select a card"}
          </div>
          {hasSelectedCard && (
            <div className="flex flex-row pb2 ml1">
              {["play", "discard"].map(action => (
                <Button
                  key={action}
                  onClick={() =>
                    onCommitAction({
                      action,
                      from: selfPlayer.index,
                      cardIndex: selectedCard
                    })
                  }
                >
                  {action}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
