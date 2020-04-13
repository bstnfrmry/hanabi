import React from "react";

import Card, { CardSize, ICardContext } from "~/components/card";
import Hint from "~/components/hint";
import PlayerName from "~/components/playerName";
import Txt from "~/components/ui/txt";
import { IHintLevel, ITurn } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  turn: ITurn;
  includePlayer: boolean;
  showDrawn: boolean;
}

export default function Turn(props: Props) {
  const { turn, includePlayer = false, showDrawn } = props;

  const game = useGame();

  return (
    <div className="dib">
      {includePlayer && (
        <>
          <Txt className="inline-flex items-center gray" value="-" />
          <PlayerName className="mh1" player={game.players[turn.action.from]} />
        </>
      )}

      {turn.action.action === "hint" && (
        <Txt className="inline-flex items-center">
          {"hinted "}
          <PlayerName className="mh1" player={game.players[turn.action.to]} />
          {" about "}
          <Hint
            className="mh1"
            hint={IHintLevel.POSSIBLE}
            type={turn.action.type}
            value={turn.action.value}
          />
          {turn.action.type === "color" && " cards"}
          {turn.action.type === "number" && "s"}
        </Txt>
      )}

      {turn.action.action === "discard" && (
        <Txt className="inline-flex items-center">
          {"discarded "}
          <Card
            card={turn.action.card}
            className="mh1"
            context={ICardContext.DISCARDED}
            size={CardSize.TINY}
          />
        </Txt>
      )}

      {turn.action.action === "play" && (
        <Txt className="inline-flex items-center">
          {"played "}
          <Card
            card={turn.action.card}
            className="mh1"
            context={ICardContext.PLAYED}
            size={CardSize.TINY}
          />
        </Txt>
      )}

      {showDrawn && turn.card && (
        <Txt className="inline-flex items-center">
          {" & drew "}
          <Card
            card={turn.card}
            className="mh1" // When we'll add A, B, C
            context={ICardContext.DRAWN}
            size={CardSize.TINY}
          />
        </Txt>
      )}
    </div>
  );
}
