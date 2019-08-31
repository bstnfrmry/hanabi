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

  const position = selfPlayer ? selfPlayer.index : game.players.length;
  const otherPlayers = [
    ...game.players.slice(0, position),
    ...game.players.slice(position + 1)
  ];

  return (
    <>
      <div className="flex-grow-1">
        <Tutorial step={ITutorialStep.OTHER_PLAYERS}>
          {otherPlayers.map((otherPlayer, i) => (
            <div key={i} className="mb1 mb2-l">
              <PlayerGame
                active={currentPlayer === otherPlayer}
                id={`player-game-${i + 1}`}
                player={otherPlayer}
                onNotifyPlayer={onNotifyPlayer}
                onSelectPlayer={onSelectPlayer}
              />
            </div>
          ))}
        </Tutorial>
      </div>
      {selfPlayer && (
        <Tutorial step={ITutorialStep.SELF_PLAYER}>
          <PlayerGame
            active={currentPlayer === selfPlayer}
            id="player-game-self"
            player={selfPlayer}
            self={true}
            onReaction={onReaction}
            onSelectPlayer={onSelectPlayer}
          />
        </Tutorial>
      )}
    </>
  );
}
