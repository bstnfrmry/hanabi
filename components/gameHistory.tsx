import React from "react";

import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  interturn: boolean;
}

export default function GameHistory(props: Props) {
  const { interturn } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();

  return (
    <div className="relative">
      <Tutorial placement="above" step={ITutorialStep.HISTORY}>
        {[...game.turnsHistory].reverse().map((turn, i) => {
          const syncing = i === 0 && !game.synced;
          const style = {
            ...(syncing && { animation: "OpacityPulse 2000ms infinite" })
          };

          return (
            <div key={i} className="mb1" style={style}>
              <Turn
                key={i}
                includePlayer={true}
                showDrawn={
                  !interturn && game.players[turn.action.from] !== selfPlayer
                }
                turn={turn}
              />
              {syncing && (
                <Txt className="ml2" size={TxtSize.SMALL} value="⏳" />
              )}
            </div>
          );
        })}
      </Tutorial>
    </div>
  );
}
