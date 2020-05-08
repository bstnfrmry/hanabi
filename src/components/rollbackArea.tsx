import React from "react";
import { useTranslation } from "react-i18next";

import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { api } from "~/lib/api";
import IGameState from "~/lib/state";

interface Props {
  onCloseArea: Function;
}

function getLastRollbackableTurn(game: IGameState) {
  let lastNonAI = 1;

  while (lastNonAI <= game.turnsHistory.length) {
    const playerIndex = game.turnsHistory[game.turnsHistory.length - lastNonAI].action.from;

    if (!game.players[playerIndex].bot) {
      break;
    }

    lastNonAI += 1;
  }

  return game.turnsHistory.length - lastNonAI;
}

export default function RollbackArea(props: Props) {
  const { onCloseArea } = props;
  const { t } = useTranslation();

  const game = useGame();
  const lastRollbackableTurn = getLastRollbackableTurn(game);
  const canRollback = lastRollbackableTurn >= 0;

  async function onRollback() {
    await api("/api/rollback-game", {
      gameId: game.id,
      turn: lastRollbackableTurn,
    });
  }

  return (
    <div className="h-100 flex flex-column items-center justify-center pa2">
      <Txt
        className="w-75 tc"
        size={TxtSize.MEDIUM}
        value={canRollback ? t("rollbackDisclaimer") : t("cannotRollback")}
      />
      <div className="mt2">
        <Button text={t("abort")} onClick={() => onCloseArea()} />
        <Button primary className="ml4" disabled={!canRollback} text={t("rollback")} onClick={() => onRollback()} />
      </div>
    </div>
  );
}
