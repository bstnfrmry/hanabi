import React from "react";

import PlayerName, { PlayerNameSize } from "~/components/playerName";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { IGameStatus } from "~/game/state";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  interturn: boolean;
  onCloseInterturn: Function;
}

export default function InstructionsArea(props: Props) {
  const { interturn, onCloseInterturn } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const isCurrentPlayer = currentPlayer === selfPlayer;

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
        {interturn && (
          <div className="flex items-center justify-between">
            <div className="flex flex-column">
              <Txt
                size={TxtSize.MEDIUM}
                value={`It's ${currentPlayer.name}'s turn!`}
              />
              <Txt
                className="mt1"
                size={TxtSize.SMALL}
                value="Continue when you're the only one to see the screen"
              />
            </div>
            <Button
              primary
              size={ButtonSize.MEDIUM}
              text={`Go !`}
              onClick={() => onCloseInterturn()}
            />
          </div>
        )}
        {!interturn && (
          <>
            {game.status !== IGameStatus.OVER && !isCurrentPlayer && (
              <Txt uppercase className="db mb3" size={TxtSize.MEDIUM}>
                {"It's "}
                <PlayerName
                  player={currentPlayer}
                  size={PlayerNameSize.MEDIUM}
                />
                {"'s turn"}
              </Txt>
            )}
            {game.status !== IGameStatus.OVER && isCurrentPlayer && (
              <>
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
                </div>
              </>
            )}
          </>
        )}
      </Tutorial>
    </div>
  );
}
