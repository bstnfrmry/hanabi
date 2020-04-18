import Fireworks from "fireworks-canvas";
import React from "react";
import posed, { PoseGroup } from "react-pose";

import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
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

  const container = document.getElementById("fireworksOverlay");
  const options = {
    maxRockets: 3, // max # of rockets to spawn
    rocketSpawnInterval: 150, // milliseconds to check if new rockets should spawn
    numParticles: 100, // number of particles to spawn when rocket explodes (+0-10)
    explosionHeight: 10, // minimum percentage of height of container at which rockets explode
    explosionChance: 0.05 // chance in each tick the rocket will explode
  };
  const fireworks = new Fireworks(container, options);
  console.log(`${reachableScore}/${game.playedCards.length}`);
  if (game.status === IGameStatus.OVER) {
    const stop = fireworks.start();
    setTimeout(() => stop(), game.playedCards.length * 200); // stop rockets from spawning
  }

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
          <Tutorial placement="below" step={ITutorialStep.WELCOME}>
            <Txt
              className="lavender"
              size={TxtSize.SMALL}
              value={history.length ? "Game started!" : "Game starts!"}
            />
          </Tutorial>
        </div>
      )}
    </div>
  );
}

const Item = posed.div({ enter: { y: 0 }, exit: { y: -100 } });
