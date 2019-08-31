import React from "react";
import { useState } from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import {
  GameView,
  useCurrentPlayer,
  useGameView,
  useSelfPlayer
} from "~/hooks/game";

interface Props {
  cardIndex?: number;
  onCommitAction: Function;
  onCloseArea: Function;
}

export default function SelfPlayerArea(props: Props) {
  const { onCommitAction, cardIndex, onCloseArea } = props;

  const view = useGameView();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [selectedCard, selectCard] = useState<number>(cardIndex);

  const hasSelectedCard = selectedCard !== null;

  return (
    <div className="flex flex-column flex-grow-1">
      <a className="pb1 pb2-l ml1 mb2" onClick={() => onCloseArea()}>
        <Txt uppercase size={TxtSize.MEDIUM} value="Your game" />
        <Txt className="ml2" value="×" />
      </a>
      <div className="flex flex-row pb2">
        {selfPlayer.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            className="ma1"
            context={ICardContext.TARGETED_PLAYER}
            hidden={true}
            position={i}
            selected={selectedCard === i}
            size={CardSize.LARGE}
            onClick={() => selectCard(i)}
          />
        ))}
      </div>
      {view === GameView.LIVE && selfPlayer === currentPlayer && (
        <>
          <Txt
            className="pb1 pb2-l ml1 mb2 mt5"
            value={
              hasSelectedCard
                ? `Card ${PositionMap[selectedCard]} selected`
                : "Select a card"
            }
          />
          {hasSelectedCard && (
            <div className="flex flex-row pb2 ml1">
              {["play", "discard"].map(action => (
                <Button
                  key={action}
                  className="mr2"
                  id={action}
                  text={action}
                  onClick={() =>
                    onCommitAction({
                      action,
                      from: selfPlayer.index,
                      cardIndex: selectedCard
                    })
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
