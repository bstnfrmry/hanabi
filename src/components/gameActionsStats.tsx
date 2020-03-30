import classnames from "classnames";
import { groupBy } from "lodash";
import React from "react";

import { percentage } from "~/components/playerStats";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";

const Colors = {
  Play: "#B7E1BC",
  Discard: "#E9AFC7",
  Hint: "#989FC1"
};

const Order = {
  hint: "Hint",
  discard: "Discard",
  play: "Play"
};

export default function GameActionsStats() {
  const game = useGame();

  const groupedTurns = groupBy(game.turnsHistory, turn => turn.action.action);

  return (
    <div className={classnames("flex justify-between w-100")}>
      {Object.keys(Order).map(column => {
        const turns = groupedTurns[column];
        const groupedPlayers = groupBy(turns, turn => turn.action.from);

        return (
          <div
            key={column}
            className="flex flex-grow-1 flex-column items-center mw4 mh3"
          >
            <Txt
              size={TxtSize.SMALL}
              style={{ color: Colors[Order[column]] }}
              value={Order[column]}
            />
            <Txt size={TxtSize.SMALL} value={`${turns.length}x`} />
            <div className="mt1">
              {Object.values(groupedPlayers).map((actionTurns, playerIndex) => {
                const player = game.players[playerIndex];
                const count = actionTurns.filter(
                  turn => turn.action.action === column
                ).length;

                return (
                  <div key={playerIndex} className="flex w-100 items-center">
                    <Txt
                      className="flex-grow-1"
                      size={TxtSize.SMALL}
                      value={player.name}
                    />
                    <Txt
                      className="ml3 ml4-m"
                      size={TxtSize.SMALL}
                      value={`${count}x`}
                    />
                    <Txt
                      className=" ml1 lavender w2 nowrap"
                      size={TxtSize.SMALL}
                      value={percentage(count, turns.length)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
