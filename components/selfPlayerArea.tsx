import { useState } from "react";

import { useSelfPlayer, useCurrentPlayer } from "~/hooks/game";

import Button from "~/components/ui/button";
import Card, { ICardContext, PositionMap, CardSize } from "~/components/card";

interface Props {
  cardIndex?: number;
  onCommitAction: Function;
  onCloseArea: Function;
}

export default function SelfPlayerArea(props: Props) {
  const { onCommitAction, cardIndex, onCloseArea } = props;

  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [selectedCard, selectCard] = useState<number>(cardIndex);

  const hasSelectedCard = selectedCard !== null;

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f7 f4-l fw2 ttu ml1 mb2">
        <a onClick={() => onCloseArea()}>
          Your game
          <span className="ml2">&times;</span>
        </a>
      </div>
      <div className="flex flex-row pb2">
        {selfPlayer.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            hidden={true}
            position={i}
            size={CardSize.LARGE}
            context={ICardContext.TARGETED_PLAYER}
            className="ma1"
            onClick={() => selectCard(i)}
            selected={selectedCard === i}
          />
        ))}
      </div>
      {selfPlayer === currentPlayer && (
        <>
          <div className="flex flex-row pb1 pb2-l f7 f4-l fw2 ttu ml1 mb2 mt5">
            {hasSelectedCard && <>Card {PositionMap[selectedCard]} selected</>}
            {!hasSelectedCard && "Select a card"}
          </div>
          {hasSelectedCard && (
            <div className="flex flex-row pb2 ml1">
              {["play", "discard"].map(action => (
                <Button
                  key={action}
                  className="mr2"
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
