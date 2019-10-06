import React, { useState } from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import PlayerName, { PlayerNameSize } from "~/components/playerName";
import Button from "~/components/ui/button";
import Txt from "~/components/ui/txt";
import Vignettes from "~/components/vignettes";
import { ICard, IHintAction, IPlayer } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

function isCardHintable(hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? card.color === hint.value
    : card.number === hint.value;
}

function textualHint(hint: IHintAction, cards: ICard[]) {
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
}

export default function OtherPlayerArea(props: Props) {
  const { player, onCommitAction, onCloseArea } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [pendingHint, setPendingHint] = useState<IHintAction>({
    type: null,
    value: null
  } as IHintAction);

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pa1 pa2-l ttu ml1 mb2 mt2">
        <a className="flex-grow-1" onClick={() => onCloseArea()}>
          <PlayerName player={player} size={PlayerNameSize.MEDIUM} />
          <Txt className="ml2" value="×" />
        </a>
      </div>
      <div className="flex justify-center flex-row pb2 ph2">
        {player.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            className="ma1 flex-grow-1"
            context={ICardContext.TARGETED_PLAYER}
            hidden={false}
            position={i}
            selected={isCardHintable(pendingHint, card)}
            size={CardSize.LARGE}
          />
        ))}
      </div>
      {selfPlayer === currentPlayer && (
        <>
          <div className="flex items-center justify-between pb2 ml2">
            <Vignettes
              pendingHint={pendingHint}
              onSelect={action => setPendingHint(action)}
            />

            <div className="ml2 flex flex-column items-end justify-center">
              {pendingHint.value && (
                <Txt
                  italic
                  className="mb3"
                  value={textualHint(pendingHint, player.hand)}
                />
              )}

              <Button
                disabled={!pendingHint.type || game.tokens.hints === 0}
                id="give-hint"
                text="Hint"
                onClick={() =>
                  onCommitAction({
                    action: "hint",
                    from: currentPlayer.index,
                    to: player.index,
                    ...pendingHint
                  })
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
