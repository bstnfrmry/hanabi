import React from "react";
import posed, { PoseGroup } from "react-pose";

import PlayerName, { PlayerNameSize } from "~/components/playerName";
import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import { IGameStatus } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  interturn: boolean;
  onSelectDiscard: Function;
}

export default function InstructionsArea(props: Props) {
  const { interturn } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const isCurrentPlayer = currentPlayer === selfPlayer;
  const showHistory = game.options.turnsHistory && game.turnsHistory.length > 0;

  return (
    <div className="pa3">
      <Tutorial placement="below" step={ITutorialStep.WELCOME}>
        {game.status === IGameStatus.OVER && (
          <Txt
            className="db"
            size={TxtSize.MEDIUM}
            value={`The game is over! Your score is ${game.playedCards.length} 🎉`}
          />
        )}
        {game.status !== IGameStatus.OVER && !isCurrentPlayer && (
          <Txt uppercase className="db mb3" size={TxtSize.MEDIUM}>
            {"It's "}
            <PlayerName player={currentPlayer} size={PlayerNameSize.MEDIUM} />
            {"'s turn"}
          </Txt>
        )}
      </Tutorial>

      {showHistory && (
        <div className="relative mh-30vh overflow-y-scroll">
          <PoseGroup>
            {[...game.turnsHistory].reverse().map((turn, i) => {
              const key = game.turnsHistory.length - i;
              const syncing = i === 0 && !game.synced;
              const style = {
                ...(syncing && { animation: "OpacityPulse 2000ms infinite" })
              };

              return (
                <Item key={key} style={style}>
                  <Turn
                    key={key}
                    includePlayer={true}
                    showDrawn={
                      !interturn &&
                      game.players[turn.action.from] !== selfPlayer
                    }
                    turn={turn}
                  />
                  {syncing && (
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
