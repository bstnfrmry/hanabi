import React from "react";

import { ITurn } from "~/game/state";
import { useGame } from "~/hooks/game";

import PlayerName from "~/components/playerName";
import Card, { ICardContext, CardSize } from "~/components/card";
import Hint from "~/components/hint";

export enum TurnSize {
  SMALL,
  MEDIUM
}

interface Props {
  turn: ITurn;
  includePlayer: boolean;
  showDrawn: boolean;
  size?: TurnSize;
}

export default function Turn(props: Props) {
  const {
    turn,
    includePlayer = false,
    showDrawn,
    size = TurnSize.MEDIUM
  } = props;
  const game = useGame();

  if (!turn) {
    return null;
  }

  const cardSize = {
    [TurnSize.SMALL]: CardSize.SMALL,
    [TurnSize.MEDIUM]: CardSize.MEDIUM
  }[size];

  return (
    <div className="inline-flex items-center">
      {includePlayer && <PlayerName player={game.players[turn.action.from]} />}

      {turn.action.action === "hint" && (
        <div className="ml1 inline-flex items-center">
          hinted&nbsp;
          <PlayerName player={game.players[turn.action.to]} />
          &nbsp;about&nbsp;
          <Hint type={turn.action.type} value={turn.action.value} hint={1} />
          {turn.action.type === "color" && <>&nbsp;cards</>}
          {turn.action.type === "number" && <>s</>}
        </div>
      )}

      {turn.action.action === "discard" && (
        <div className="ml1 inline-flex items-center">
          discarded&nbsp;
          <Card
            card={turn.action.card}
            context={ICardContext.DISCARDED}
            size={cardSize}
          />
        </div>
      )}

      {turn.action.action === "play" && (
        <div className="ml1 inline-flex items-center">
          played&nbsp;
          <Card
            card={turn.action.card}
            context={ICardContext.PLAYED}
            size={cardSize}
          />
        </div>
      )}

      {showDrawn && turn.card && (
        <div className="ml1 inline-flex items-center">
          & drew&nbsp;
          <Card card={turn.card} context={ICardContext.DRAWN} size={cardSize} />
        </div>
      )}
    </div>
  );
}
