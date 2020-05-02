import { groupBy } from "lodash";
import React from "react";

import { percentage } from "~/components/playerStats";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";

const Colors = {
  Played: "#B7E1BC",
  Discarded: "#fdfd96",
  Hinted: "#A2D3F6",
};

const Order = {
  hint: "Hinted",
  discard: "Discarded",
  play: "Played",
};

export default function GameActionsStats() {
  const game = useGame();

  if (!game.turnsHistory.length) {
    return null;
  }

  const groupedTurns = groupBy(game.turnsHistory, turn => turn.action.action);
  const hintsCount = game.turnsHistory.filter(turn => turn.action.action === "hint").length;
  const playsCount = game.turnsHistory.filter(turn => turn.action.action === "play").length || 1;
  const playsPerHint = (hintsCount / playsCount).toFixed(2);

  return (
    <div className="flex flex-column items-center">
      {playsCount > 0 && (
        <Txt size={TxtSize.MEDIUM}>
          Average plays per hint: <span className="txt-yellow">{playsPerHint}</span>
        </Txt>
      )}

      <div className="flex justify-center-l w-100 mt4">
        {Object.keys(Order).map(column => {
          const turns = groupedTurns[column] || [];
          const groupedPlayers = groupBy(turns, turn => turn.action.from);

          return (
            <div key={column} className="flex flex-grow-1 flex-column items-center mw4 mh4 mh5-l">
              <Txt size={TxtSize.SMALL} style={{ color: Colors[Order[column]] }} value={Order[column]} />
              <Txt className="lavender" size={TxtSize.SMALL} value={`${turns.length}x`} />
              <div className="mt1">
                {Object.values(groupedPlayers).map((actionTurns, playerIndex) => {
                  const player = game.players[playerIndex];
                  const count = actionTurns.filter(turn => turn.action.action === column).length;

                  return (
                    <div key={playerIndex} className="flex w-100 items-center">
                      <Txt className="flex-grow-1" size={TxtSize.SMALL} value={player.name} />
                      <Txt className="ml3 ml4-m" size={TxtSize.SMALL} value={count} />
                      <Txt
                        className="ml2 lavender w2 nowrap"
                        size={TxtSize.SMALL}
                        value={`· ${percentage(count, turns.length)}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
