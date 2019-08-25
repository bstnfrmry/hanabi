import { useState } from "react";

import { IPlayer, IHintAction, ICard } from "~/game/state";
import { useGame, useSelfPlayer, useCurrentPlayer } from "~/hooks/game";

import PlayerName from "~/components/playerName";
import Card, { ICardContext, PositionMap, ICardSize } from "~/components/card";
import Vignettes from "~/components/vignettes";
import Button from "~/components/ui/button";

interface Props {
  player: IPlayer;
  onCommitAction: Function;
}

export default function OtherPlayerArea(props: Props) {
  const { player, onCommitAction } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const [pendingHint, setPendingHint] = useState<IHintAction>({
    type: null,
    value: null
  } as IHintAction);

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2">
        <PlayerName player={player} />
        's game
      </div>
      <div className="flex flex-row pb2">
        {player.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            hidden={false}
            position={i}
            size={ICardSize.LARGE}
            context={ICardContext.TARGETED_PLAYER}
            className="ma1"
            selected={isCardHintable(pendingHint, card)}
          />
        ))}
      </div>
      {selfPlayer === currentPlayer && (
        <>
          <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2 mt3">
            Select a hint below
          </div>
          <div className="flex flex-row pb2 ml1">
            <Vignettes
              onSelect={action => setPendingHint(action)}
              pendingHint={pendingHint}
            />
            <div className="ml3">
              <div className="h2 f5 fw3 i">
                {textualHint(pendingHint, player.hand)}
              </div>
              <Button
                disabled={game.tokens.hints === 0}
                onClick={() =>
                  onCommitAction({
                    action: "hint",
                    from: game.currentPlayer,
                    to: player.index,
                    ...pendingHint
                  } as IHintAction)
                }
              >
                Give hint
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function isCardHintable(hint: IHintAction, card: ICard) {
  return hint.type === "color"
    ? card.color === hint.value
    : card.number === hint.value;
}

function textualHint(hint: IHintAction, cards: ICard[]) {
  if (hint.value === null) {
    return "";
  }

  const hintableCards = cards
    .map((c, i) => (isCardHintable(hint, c) ? i : null))
    .filter(i => i !== null)
    .map(i => PositionMap[i]);

  if (hintableCards.length === 0) {
    if (hint.type === "color") return `You have no ${hint.value} cards.`;
    else return `You have no ${hint.value}s.`;
  } else if (hintableCards.length === 1) {
    if (hint.type === "color")
      return `Your card ${hintableCards[0]} is ${hint.value}!`;
    else return `Your card ${hintableCards[0]} is a ${hint.value}!`;
  } else {
    if (hint.type === "color")
      return `Your cards ${hintableCards.join(", ")} are ${hint.value}!`;
    else return `Your cards ${hintableCards.join(", ")} are ${hint.value}s!`;
  }
}
