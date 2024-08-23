import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { getStateAtTurn } from "~/lib/actions";
import { updateGame } from "~/lib/firebase";
import IGameState from "~/lib/state";
import { logFailedPromise } from "~/lib/errors";

interface Props {
  onCloseArea: () => void;
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

  function onRollback() {
    updateGame(getStateAtTurn(game, lastRollbackableTurn)).catch(logFailedPromise);
  }

  return (
    <Modal isOpen onRequestClose={() => onCloseArea()}>
      <div className="h-100 flex flex-column items-center justify-center pa2">
        <Txt
          className="tc w-75"
          size={TxtSize.MEDIUM}
          value={canRollback ? t("rollbackDisclaimer") : t("cannotRollback")}
        />
        <div className="mt4">
          <Button text={t("abort")} onClick={() => onCloseArea()} />
          <Button primary className="ml4" disabled={!canRollback} text={t("rollback")} onClick={() => onRollback()} />
        </div>
      </div>
    </Modal>
  );
}
