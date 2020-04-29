import React from "react";

import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { getStateAtTurn } from "~/game/actions";
import IGameState from "~/game/state";
import { useGame } from "~/hooks/game";
import useNetwork from "~/hooks/network";

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
  const network = useNetwork();

  const game = useGame();
  const lastRollbackableTurn = getLastRollbackableTurn(game);
  const canRollback = lastRollbackableTurn >= 0;

  function onRollback() {
    network.updateGame(getStateAtTurn(game, lastRollbackableTurn));
  }

  return (
    <div className="h-100 flex flex-column items-center justify-center pa2">
      <Txt
        className="w-75 tc"
        size={TxtSize.MEDIUM}
        value={canRollback ? "You're about to roll back the last action!" : "You cannot rollback the game yet"}
      />
      <div className="mt2">
        <Button text="Abort" onClick={() => onCloseArea()} />
        <Button primary className="ml4" disabled={!canRollback} text="Roll back" onClick={() => onRollback()} />
      </div>
    </div>
  );
}
