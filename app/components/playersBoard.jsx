import React from "react";
import PlayerGame from "./playerGame";

export default ({ game, onSelectPlayer }) => {
  const [selfPlayer, ...otherPlayers] = game.players

  return <div className="flex flex-column content-end h-100">
    <div className="flex-column ph4 pv4 bb bg-gray-light b--gray-light">
      {otherPlayers.map((player, i) => (
        <div
          key={i}
          className="mb4"
        >
          <PlayerGame
            player={player}
            onSelectPlayer={onSelectPlayer}
            active={player === game.currentPlayer}
          />
        </div>
      ))}
    </div>
    <div className="pa4 bg-gray-light b--gray-light bt" style={{ marginTop: "auto" }}>
      <PlayerGame
        player={selfPlayer}
        self={true}
        onSelectPlayer={onSelectPlayer}
        active={selfPlayer === game.currentPlayer}
      />
    </div>
  </div>
};
