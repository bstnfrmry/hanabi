import React, { useState } from "react";

import PlayerName, { PlayerNameSize } from "~/components/playerName";
import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { IGameStatus } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  interturn: boolean;
  onSelectDiscard: Function;
}

export default function InstructionsArea(props: Props) {
  const { onSelectDiscard, interturn } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const isCurrentPlayer = currentPlayer === selfPlayer;
  const [expanded, setExpanded] = useState(false);

  const canExpand = game.turnsHistory.length > game.options.playersCount - 1;

  const showHistory = game.options.turnsHistory && game.turnsHistory.length > 0;

  return (
    <div>
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
        <div className="relative mh-30vh overflow-y-scroll">
          {game.turnsHistory
            .slice(expanded ? -100 : -(game.options.playersCount - 1))
            .reverse()
            .map((turn, i) => {
              const syncing = i === 0 && !game.synced;
              const style = {
                ...(syncing && { animation: "OpacityPulse 2000ms infinite" })
              };

              return (
                <div key={i} className="mt1 mt3-l pointer" style={style}>
                  <Turn
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
                </div>
              );
            })}
          {canExpand && (
            <Button
              className="absolute top-0 right-0"
              size={ButtonSize.TINY}
              text={expanded ? "▲" : "▼"}
              onClick={() => setExpanded(!expanded)}
            />
          )}
        </div>
      )}
    </div>
  );
}
