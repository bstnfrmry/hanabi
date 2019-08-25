import React from "react";
import { range } from "lodash";

import { useGame, useSelfPlayer, useCurrentPlayer } from "~/hooks/game";

import PlayerGame from "~/components/playerGame";

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
      </div>
      {selfPlayer && (
        <PlayerGame
          player={selfPlayer}
          self={true}
          active={currentPlayer === selfPlayer}
          onSelectPlayer={onSelectPlayer}
          onReaction={onReaction}
        />
      )}
    </>
  );
}
