import React from "react";

import PlayerName, { PlayerNameSize } from "~/components/playerName";
import Turn from "~/components/turn";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

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
    <div className="flex-grow-1">
      <Tutorial placement="below" step={ITutorialStep.WELCOME}>
        {!isCurrentPlayer && (
          <Txt uppercase className="db mb3" size={TxtSize.MEDIUM}>
            {"It's "}
            <PlayerName player={currentPlayer} size={PlayerNameSize.MEDIUM} />
            {"s turn"}
          </Txt>
        )}
        {isCurrentPlayer && (
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
            .slice(-5)
            .reverse()
            .map((turn, i) => {
              return (
                <div key={i} className="mt1 mt3-l">
                  <Turn
                    includePlayer={true}
                    showDrawn={game.players[turn.action.from] !== selfPlayer}
                    turn={turn}
                  />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
