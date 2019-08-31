import React, { useState } from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import PlayerName from "~/components/playerName";
import Button from "~/components/ui/button";
import Vignettes from "~/components/vignettes";
import { ICard, IHintAction, IPlayer } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

function isCardHintable(hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? card.color === hint.value
    : card.number === hint.value;
}

function textualHint(hint: IHintAction, cards: ICard[]) {
  if (hint.value === null) return "";

  const hintableCards = cards
    .map((c, i) => (isCardHintable(hint, c) ? i : null))
    .filter(i => i !== null)
    .map(i => PositionMap[i]);

  if (hintableCards.length === 0) {
    if (hint.type === "color") return `You have no ${hint.value} cards.`;
    else return `You have no ${hint.value}s.`;
  }

  if (hintableCards.length === 1) {
    if (hint.type === "color")
      return `Your card ${hintableCards[0]} is ${hint.value}`;
    else return `Your card ${hintableCards[0]} is a ${hint.value}`;
  }

  if (hint.type === "color")
    return `Your cards ${hintableCards.join(", ")} are ${hint.value}`;

  return `Your cards ${hintableCards.join(", ")} are ${hint.value}s`;
}

interface Props {
  player: IPlayer;
  onCommitAction: Function;
  onCloseArea: Function;
  onImpersonate: Function;
}

export default function OtherPlayerArea(props: Props) {
  const { player, onCommitAction, onCloseArea, onImpersonate } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [pendingHint, setPendingHint] = useState<IHintAction>({
    type: null,
    value: null
  } as IHintAction);

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f7 f4-l fw2 ttu ml1 mb2">
        <a onClick={() => onCloseArea()} className="flex-grow-1">
          <PlayerName player={player} />
          &apos;s game
          <span className="ml2">&times;</span>
        </a>
        <a onClick={() => onImpersonate(player)}>🕵🏻‍♀️</a>
      </div>
      <div className="flex flex-row pb2">
        {player.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            hidden={false}
            position={i}
            size={CardSize.LARGE}
            context={ICardContext.TARGETED_PLAYER}
            className="ma1"
            selected={isCardHintable(pendingHint, card)}
          />
        ))}
      </div>
      {selfPlayer === currentPlayer && (
        <>
          <div className="flex flex-row pb1 pb2-l f7 f4-l fw2 ttu ml1 mb2 mt5">
            Select a hint below
          </div>
          <div className="flex flex-row pb2 ml1">
            <Vignettes
              onSelect={action => setPendingHint(action)}
              pendingHint={pendingHint}
            />
            <div className="ml2">
              <div className="h2 f6 f4-l fw3 i overflow-hidden">
                {textualHint(pendingHint, player.hand)}
              </div>
              <Button
                disabled={!pendingHint.type || game.tokens.hints === 0}
                text="Give hint"
                onClick={() =>
                  onCommitAction({
                    action: "hint",
                    from: game.currentPlayer,
                    to: player.index,
                    ...pendingHint
                  } as IHintAction)
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
