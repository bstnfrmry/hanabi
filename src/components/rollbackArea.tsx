import React from "react";

import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { goBackToState } from "~/game/actions";
import { useGame } from "~/hooks/game";
import useNetwork from "~/hooks/network";

interface Props {
  onCloseArea: Function;
}

export default function RollbackArea(props: Props) {
  const { onCloseArea } = props;
  const network = useNetwork();

  const game = useGame();

  async function onRollback() {
    let lastNonAI = 1;
    // check whether the previous player is a bot
    // adding players length to avoid a negative mod
    let checkedPlayer =
      (game.players.length + game.currentPlayer - 1) % game.players.length;
    while (game.players[checkedPlayer].bot && lastNonAI < game.players.length) {
      lastNonAI += 1;
      // check the player even before
      checkedPlayer =
        (game.currentPlayer + game.players.length - lastNonAI) %
        game.players.length;
    }

    network.updateGame(goBackToState(game, lastNonAI));
  }

  return (
    <div className="h-100 flex flex-column items-center justify-center pa2">
      <Txt
        className="w-75"
        size={TxtSize.MEDIUM}
        value="You're about to roll back the last action!"
      />
      <div className="mt4">
        <Button text="Abort" onClick={() => onCloseArea()} />
        <Button
          primary
          className="ml4"
          text="Roll back"
          onClick={() => onRollback()}
        />
      </div>
    </div>
  );
}
