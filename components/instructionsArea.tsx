import React from "react";
import posed, { PoseGroup } from "react-pose";

import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { isReplayMode } from "~/game/actions";
import { GameMode, IGameStatus } from "~/game/state";
import { useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  interturn: boolean;
  onSelectDiscard: Function;
  onReplay: Function;
  onReplayPrevious: Function;
  onReplayNext: Function;
  onStopReplay: Function;
}

export default function InstructionsArea(props: Props) {
  const {
    interturn,
    onReplay,
    onReplayPrevious,
    onReplayNext,
    onStopReplay
  } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();

  const history = isReplayMode(game)
    ? game.originalGame.turnsHistory.slice(0, game.replayCursor)
    : game.turnsHistory;

  const showHistory = isReplayMode(game) ? true : history;
  const showSync = game.options.gameMode === GameMode.NETWORK;
  return (
    <div>
      <Tutorial placement="below" step={ITutorialStep.WELCOME}>
        {game.status === IGameStatus.OVER && (
          <div className="flex items-center mb2">
            {!isReplayMode(game) && (
              <>
                <Txt
                  className="db"
                  size={TxtSize.MEDIUM}
                  value={`The game is over! Your score is ${game.playedCards.length} 🎉`}
                />
                <Button
                  className="ml3"
                  size={ButtonSize.TINY}
                  text="Watch replay"
                  onClick={() => onReplay()}
                />
              </>
            )}
            {isReplayMode(game) && (
              <>
                <Txt
                  className="db"
                  size={TxtSize.MEDIUM}
                  value={`Replay mode - Turn ${game.replayCursor} / ${game.originalGame.history.length}`}
                />
                <Button
                  className="ml3"
                  disabled={game.replayCursor === 0}
                  size={ButtonSize.TINY}
                  text="<"
                  onClick={() => onReplayPrevious()}
                />
                <Button
                  className="ml3"
                  disabled={
                    game.replayCursor === game.originalGame.history.length - 1
                  }
                  size={ButtonSize.TINY}
                  text=">"
                  onClick={() => onReplayNext()}
                />
                <Button
                  className="ml3"
                  size={ButtonSize.TINY}
                  text="Exit"
                  onClick={() => onStopReplay()}
                />
              </>
            )}
          </div>
        )}
      </Tutorial>

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

              return (
                <Item key={key} style={style}>
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
                </Item>
              );
            })}
          </PoseGroup>
        </div>
      )}
    </div>
  );
}

const Item = posed.div({ enter: { y: 0 }, exit: { y: -100 } });
