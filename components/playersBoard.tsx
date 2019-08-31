import { range } from "lodash";
import React from "react";

import PlayerGame from "~/components/playerGame";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  onSelectPlayer: Function;
  onNotifyPlayer: Function;
  onReaction: Function;
}

export default function PlayersBoard(props: Props) {
  const { onSelectPlayer, onNotifyPlayer, onReaction } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();

  // all the other players in order (starting with the next one)
  const otherPlayers = selfPlayer
    ? range(game.players.length - 1).map(
        i => game.players[(i + selfPlayer.index + 1) % game.players.length]
      )
    : [];

  return (
    <>
      <div className="flex-grow-1">
        <Tutorial step={ITutorialStep.OTHER_PLAYERS}>
          {otherPlayers.map((otherPlayer, i) => (
            <div key={i} className="mb1 mb2-l">
              <PlayerGame
                player={otherPlayer}
                onSelectPlayer={onSelectPlayer}
                onNotifyPlayer={onNotifyPlayer}
                active={currentPlayer === otherPlayer}
              />
            </div>
          ))}
        </Tutorial>
      </div>
      {selfPlayer && (
        <Tutorial step={ITutorialStep.SELF_PLAYER}>
          <PlayerGame
            player={selfPlayer}
            self={true}
            active={currentPlayer === selfPlayer}
            onSelectPlayer={onSelectPlayer}
            onReaction={onReaction}
          />
        </Tutorial>
      )}
    </>
  );
}
