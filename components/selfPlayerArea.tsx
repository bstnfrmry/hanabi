import React from "react";
import { useState } from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { MaxHints } from "~/game/actions";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  cardIndex?: number;
  onCommitAction: Function;
  onCloseArea: Function;
}

export default function SelfPlayerArea(props: Props) {
  const { onCommitAction, cardIndex, onCloseArea } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [selectedCard, selectCard] = useState<number>(cardIndex);

  const hasSelectedCard = selectedCard !== null;

  return (
    <div className="flex flex-column flex-grow-1 flex-row-l justify-end-l w-100 pv3-l">
      <a
        className="pb1 pb2-l ml2 mb2 mt3 pa2-l flex-grow-1 "
        onClick={() => onCloseArea()}
      >
        <Txt uppercase size={TxtSize.MEDIUM} value="Your game" />
        <Txt className="ml2" value="×" />
      </a>
      <div className="flex flex-row justify-end pb2 ph2">
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
      {selfPlayer === currentPlayer && (
        <div className="flex flex-column items-end">
          <div className="flex justify-end items-center h-100-l">
            {hasSelectedCard && (
              <Txt
                className="pb1 pb2-l ml1 mb2 mr3 ml2-l"
                value={`Card ${PositionMap[selectedCard]} selected`}
              />
            )}

            {hasSelectedCard && (
              <div className="flex flex pb2">
                {["discard", "play"].map(action => (
                  <Button
                    key={action}
                    className="mr2"
                    disabled={action === "discard" && game.tokens.hints === 8}
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
          </div>
          {game.tokens.hints === MaxHints && (
            <Txt className="orange mr2 flex flex-column items-end">
              <span>8 tokens</span>
              <span>You cannot discard</span>
            </Txt>
          )}
        </div>
      )}
    </div>
  );
}
