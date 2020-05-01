import React from "react";
import { useTranslation } from "react-i18next";

import Card, { CardSize, ICardContext, PositionMap } from "~/components/card";
import Hint from "~/components/hint";
import PlayerName from "~/components/playerName";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { IHintLevel, ITurn } from "~/lib/state";

interface Props {
  turn: ITurn;
  includePlayer: boolean;
  showDrawn: boolean;
  showPosition?: boolean;
}

export default function Turn(props: Props) {
  const { turn, includePlayer = false, showDrawn, showPosition = true } = props;
  const { t } = useTranslation();

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
          {t("hintedTurn")}
          <PlayerName className="mh1" player={game.players[turn.action.to]} />
          {t("aboutTurn")}
          <Hint className="mh1" hint={IHintLevel.POSSIBLE} type={turn.action.type} value={turn.action.value} />
          {t("pluralTurn")}
          {showPosition && turn.action.cardsIndex && (
            <Txt
              className="lavender ml1"
              size={TxtSize.TINY}
              value={`${turn.action.cardsIndex.map(index => PositionMap[index]).join(", ")}`}
            />
          )}
        </Txt>
      )}

      {turn.action.action === "discard" && (
        <Txt className="inline-flex items-center">
          {t("discardedTurn")}
          <Card card={turn.action.card} className="mh1" context={ICardContext.DISCARDED} size={CardSize.TINY} />
          <Txt className="lavender mr1" size={TxtSize.TINY} value={`${PositionMap[turn.action.cardIndex]}`} />
        </Txt>
      )}

      {turn.action.action === "play" && (
        <Txt className="inline-flex items-center">
          {t("playedTurn")}
          <Card card={turn.action.card} className="mh1" context={ICardContext.PLAYED} size={CardSize.TINY} />
          <Txt className="lavender mr1" size={TxtSize.TINY} value={`${PositionMap[turn.action.cardIndex]}`} />
        </Txt>
      )}

      {showDrawn && turn.card && (
        <Txt className="inline-flex items-center">
          {t("cardDranwTurn")}
          <Card card={turn.card} className="ml1" context={ICardContext.DRAWN} size={CardSize.TINY} />
        </Txt>
      )}
    </div>
  );
}
