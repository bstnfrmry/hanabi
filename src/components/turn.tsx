import React from "react";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Hint from "~/components/hint";
import PlayerName from "~/components/playerName";
import Txt, { TxtSize } from "~/components/ui/txt";
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
    <div className="di mb2 pre">
      {includePlayer && (
        <>
          <PlayerName player={game.players[turn.action.from]} />
          <Txt value=" " />
        </>
      )}

      {turn.action.action === "hint" && (
        <Txt className="inline-flex items-center">
          {"hinted "}
          <PlayerName player={game.players[turn.action.to]} />
          {" about "}
          <Hint
            hint={IHintLevel.POSSIBLE}
            type={turn.action.type}
            value={turn.action.value}
          />
          {turn.action.type === "color" && " cards"}
          {turn.action.type === "number" && "s"}
          {turn.action.cardsIndex && (
            <Txt
              className="lavender ml1"
              size={TxtSize.TINY}
              value={`${turn.action.cardsIndex
                .map(index => PositionMap[index])
                .join(", ")}`}
            />
          )}
        </Txt>
      )}

      {turn.action.action === "discard" && (
        <Txt className="inline-flex items-center">
          {"discarded "}
          <Card
            card={turn.action.card}
            context={ICardContext.DISCARDED}
            size={CardSize.TINY}
          />
          <Txt
            className="lavender ml1"
            size={TxtSize.TINY}
            value={`${PositionMap[turn.action.cardIndex]}`}
          />
        </Txt>
      )}

      {turn.action.action === "play" && (
        <Txt className="inline-flex items-center">
          {"played "}
          <Card
            card={turn.action.card}
            context={ICardContext.PLAYED}
            size={CardSize.TINY}
          />
          <Txt
            className="lavender ml1"
            size={TxtSize.TINY}
            value={`${PositionMap[turn.action.cardIndex]}`}
          />
        </Txt>
      )}

      {showDrawn && turn.card && (
        <Txt className="inline-flex items-center">
          {" & drew "}
          <Card
            card={turn.card}
            context={ICardContext.DRAWN}
            size={CardSize.TINY}
          />
        </Txt>
      )}
    </div>
  );
}
