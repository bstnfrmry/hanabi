import React from "react";
import PlayerGame from "./playerGame";
import { range } from "lodash";
import IGameState, { IPlayer } from "../game/state";

interface IPlayersBoard {
  game: IGameState;
  player: IPlayer | undefined;
  onSelectPlayer: any;
}

export default ({ game, player, onSelectPlayer }: IPlayersBoard) => {
  // all the other players in order (starting with the next one)
  let otherPlayers;
  if (!player) {
    otherPlayers = [];
  } else {
    otherPlayers = range(game.players.length - 1).map(
      i => game.players[(i + player.index + 1) % game.playersCount]
    );
  }

  return (
    <div className="flex flex-column h-100 overflow-y-scroll">
      <div className="flex-column pa2 pa4-l bg-gray-light">
        {otherPlayers.map((otherPlayer, i) => (
          <div key={i} className="mb2 mb4-l">
            <PlayerGame
              game={game}
              player={otherPlayer}
              onSelectPlayer={onSelectPlayer}
              active={otherPlayer === game.currentPlayer}
            />
          </div>
        ))}
      </div>
      {player && (
        <div
          className="flex-grow-1 pa2 pa4-l bg-gray-light b--gray-light bt"
          style={{ marginTop: "auto" }}
        >
          <PlayerGame
            game={game}
            player={player}
            self={true}
            onSelectPlayer={onSelectPlayer}
            active={player.index === game.currentPlayer}
          />
        </div>
      )}
    </div>
  );
};
