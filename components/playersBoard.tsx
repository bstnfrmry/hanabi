import React from "react";
import PlayerGame from "./playerGame";
import { range } from "lodash";
import IGameState, { IPlayer } from "../game/state";

interface IPlayersBoard {
  game: IGameState;
  player: IPlayer | undefined;
  onSelectPlayer: any;
  onNotifyPlayer: Function;
}

export default ({
  game,
  player,
  onSelectPlayer,
  onNotifyPlayer
}: IPlayersBoard) => {
  // all the other players in order (starting with the next one)
  let otherPlayers;
  if (!player) {
    otherPlayers = [];
  } else {
    otherPlayers = range(game.players.length - 1).map(
      i => game.players[(i + player.index + 1) % game.players.length]
    );
  }

  return (
    <div className="flex flex-column h-100 overflow-y-scroll">
      <div className="flex-grow-1">
        {otherPlayers.map((otherPlayer, i) => (
          <div key={i} className="pa2 mb4 mb4-l">
            <PlayerGame
              game={game}
              player={otherPlayer}
              onSelectPlayer={onSelectPlayer}
              onNotifyPlayer={onNotifyPlayer}
              active={game.players[game.currentPlayer] === otherPlayer}
            />
          </div>
        ))}
      </div>
      {player && (
        <div className="pa2">
          <PlayerGame
            game={game}
            player={player}
            self={true}
            onSelectPlayer={onSelectPlayer}
            active={game.players[game.currentPlayer] === player}
          />
        </div>
      )}
    </div>
  );
};
