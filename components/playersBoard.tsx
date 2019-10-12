import React from "react";

import PlayerGame from "~/components/playerGame";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";

interface Props {
  interturn: boolean;
  onSelectPlayer: Function;
  onNotifyPlayer: Function;
  onReaction: Function;
}

export default function PlayersBoard(props: Props) {
  const { interturn, onSelectPlayer, onNotifyPlayer, onReaction } = props;

  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();

  const position = selfPlayer ? selfPlayer.index : game.players.length;
  const otherPlayers = [
    ...game.players.slice(position + 1),
    ...game.players.slice(0, position)
  ];

  return (
    <>
      <div className="flex flex-column justify-end flex-grow-1">
        <Tutorial step={ITutorialStep.OTHER_PLAYERS}>
          {otherPlayers.map((otherPlayer, i) => (
            <div key={i} className="bt b--yellow">
              <PlayerGame
                active={currentPlayer === otherPlayer}
                id={`player-game-${i + 1}`}
                interturn={interturn}
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
          <div className="bt bb b--yellow">
            <PlayerGame
              active={currentPlayer === selfPlayer}
              id="player-game-self"
              interturn={interturn}
              player={selfPlayer}
              self={true}
              onReaction={onReaction}
              onSelectPlayer={onSelectPlayer}
            />
          </div>
        </Tutorial>
      )}
    </>
  );
}
