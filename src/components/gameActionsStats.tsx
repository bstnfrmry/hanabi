import { groupBy } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";

import { percentage } from "~/components/playerStats";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";

export default function GameActionsStats() {
  const game = useGame();
  const { t } = useTranslation();

  if (!game.turnsHistory.length) {
    return null;
  }

  const Order = {
    hint: {
      text: t("hinted"),
      color: "#A2D3F6",
    },
    discard: {
      text: t("discarded"),
      color: "#fdfd96",
    },
    play: {
      text: t("played"),
      color: "#B7E1BC",
    },
  };

  const groupedTurns = groupBy(game.turnsHistory, turn => turn.action.action);
  const hintsCount = game.turnsHistory.filter(turn => turn.action.action === "hint").length;
  const playsCount = game.turnsHistory.filter(turn => turn.action.action === "play").length || 1;
  const playsPerHint = (hintsCount / playsCount).toFixed(2);

  return (
    <div className="flex flex-column items-center">
      {playsCount > 0 && (
        <Txt size={TxtSize.MEDIUM}>
          {t("playHints")}: <span className="txt-yellow">{playsPerHint}</span>
        </Txt>
      )}

      <div className="flex justify-center-l w-100 mt4">
        {Object.keys(Order).map(column => {
          const turns = groupedTurns[column] || [];
          const groupedPlayers = groupBy(turns, turn => turn.action.from);

          return (
            <div key={column} className="flex flex-grow-1 flex-column items-center mw4 mh4 mh5-l">
              <Txt size={TxtSize.SMALL} style={{ color: Order[column].color }} value={Order[column].text} />
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
                        multiline={false}
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
