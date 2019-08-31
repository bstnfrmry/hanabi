import React from "react";

import { useGame, useSelfPlayer, useCurrentPlayer } from "~/hooks/game";

import PlayerName from "~/components/playerName";
import Turn, { TurnSize } from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";

interface Props {
  onSelectDiscard: Function;
}

export default function InstructionsArea(props: Props) {
  const { onSelectDiscard } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const isCurrentPlayer = currentPlayer === selfPlayer;

  const showHistory = game.options.turnsHistory && game.turnsHistory.length > 0;

  return (
    <div className="flex-grow-1 f7 f3-l fw2 lh-copy">
      <Tutorial step={ITutorialStep.WELCOME} placement="below">
        {!isCurrentPlayer && (
          <div className="ttu">
            It&apos;s <PlayerName player={currentPlayer} />
            &apos;s turn
          </div>
        )}
        {isCurrentPlayer && (
          <div>
            <div className="ttu mb2">Your turn!</div>
            <div className="mb1">
              - Give a hint by tapping on your playmates&apos; hand
            </div>
            <div className="mb1">
              - Play or discard by tapping on your own game
            </div>
            <a onClick={() => onSelectDiscard()}>
              - <span className="underline">Check discarded cards</span>
            </a>
          </div>
        )}
      </Tutorial>

      {showHistory && (
        <>
          <div className="ttu mt3">Last actions:</div>
          {game.turnsHistory
            .slice(-10)
            .reverse()
            .map((turn, i) => {
              return (
                <div key={i} className="mt1 f4">
                  <Turn
                    turn={turn}
                    includePlayer={true}
                    showDrawn={game.players[turn.action.from] !== selfPlayer}
                    size={TurnSize.SMALL}
                  />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
