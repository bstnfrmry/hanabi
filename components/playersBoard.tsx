import React from "react";
import PlayerGame from "./playerGame";
import { range } from "lodash";
import { useGame, useSelfPlayer, useCurrentPlayer } from "../hooks/game";

interface IPlayersBoard {
  onSelectPlayer: any;
  onNotifyPlayer: Function;
}

export default (props: IPlayersBoard) => {
  const { onSelectPlayer, onNotifyPlayer } = props;

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
    <div className="flex flex-column h-100 overflow-y-scroll w-50">
      <div className="flex-grow-1">
        {otherPlayers.map((otherPlayer, i) => (
          <div key={i} className="pa2 mb4 mb4-l">
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
        <div className="pa2">
          <PlayerGame
            player={selfPlayer}
            self={true}
            onSelectPlayer={onSelectPlayer}
            active={currentPlayer === selfPlayer}
          />
        </div>
      )}
    </div>
  );
};
