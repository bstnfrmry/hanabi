import React from "react";
import posed, { PoseGroup } from "react-pose";

import Turn from "~/components/turn";
import Txt, { TxtSize } from "~/components/ui/txt";
import { isReplayMode } from "~/game/actions";
import { GameMode } from "~/game/state";
import { useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  reachableScore?: number;
  interturn: boolean;
  onReplay: Function;
  onToggleStats: Function;
}

export default function InstructionsArea(props: Props) {
  const { interturn } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();

  const history = isReplayMode(game)
    ? game.originalGame.turnsHistory.slice(0, game.replayCursor)
    : game.turnsHistory;

  const showHistory = isReplayMode(game) ? true : history;
  const showSync = game.options.gameMode === GameMode.NETWORK;
  return (
    <div className="flex-grow-1 overflow-y-scroll">
      {showHistory && (
        <div className="relative">
          <PoseGroup>
            {[...history].reverse().map((turn, i) => {
              const key = history.length - i;
              const syncing = i === 0 && !game.synced;
              const style = {
                ...(showSync &&
                  syncing && { animation: "OpacityPulse 2000ms infinite" })
              };
              const PoseItem = isReplayMode(game) ? posed.div() : Item;

              return (
                <PoseItem key={key} style={style}>
                  <Turn
                    key={key}
                    includePlayer={true}
                    showDrawn={
                      !interturn &&
                      game.players[turn.action.from].id !== selfPlayer.id
                    }
                    turn={turn}
                  />
                  {showSync && syncing && (
                    <Txt className="ml2" size={TxtSize.SMALL} value="⏳" />
                  )}
                </PoseItem>
              );
            })}
          </PoseGroup>
        </div>
      )}
    </div>
  );
}

const Item = posed.div({ enter: { y: 0 }, exit: { y: -100 } });
