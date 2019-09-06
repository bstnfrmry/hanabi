import React from "react";

import PlayerName, { PlayerNameSize } from "~/components/playerName";
import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import { IGameStatus } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  onSelectDiscard: Function;
  onTurnPeak: (turn: number) => void;
}

export default function InstructionsArea(props: Props) {
  const { onSelectDiscard, onTurnPeak } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const isCurrentPlayer = currentPlayer === selfPlayer;

  const showHistory = game.options.turnsHistory && game.turnsHistory.length > 0;

  return (
    <div className="flex-grow-1">
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
        {game.status !== IGameStatus.OVER && isCurrentPlayer && (
          <div className="flex flex-column">
            <Txt
              uppercase
              className="mb3"
              id="your-turn"
              size={TxtSize.MEDIUM}
              value="Your turn!"
            />
            <Txt
              className="mb2"
              value="Give a hint by tapping on your playmates' hand"
            />
            <Txt
              className="mb2"
              value="Play or discard by tapping on your own game"
            />

            <a className="underline" onClick={() => onSelectDiscard()}>
              <Txt value="Check discarded cards" />
            </a>
          </div>
        )}
      </Tutorial>

      {showHistory && (
        <>
          <Txt
            uppercase
            className="dib mt4"
            size={TxtSize.MEDIUM}
            value="Last actions"
          />
          {game.turnsHistory
            .slice(-20)
            .reverse()
            .map((turn, i) => {
              const syncing = i === 0 && !game.synced;
              const style = {
                ...(syncing && { animation: "OpacityPulse 2000ms infinite" })
              };

              return (
                <div
                  key={i}
                  className="mt1 mt3-l pointer"
                  style={style}
                  onClick={() => onTurnPeak(i + 1)}
                >
                  <Turn
                    includePlayer={true}
                    showDrawn={game.players[turn.action.from] !== selfPlayer}
                    turn={turn}
                  />
                  {syncing && (
                    <Txt className="ml2" size={TxtSize.SMALL} value="⏳" />
                  )}
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
