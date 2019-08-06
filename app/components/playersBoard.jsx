import React from "react";
import PlayerGame from "./playerGame";
import SelfGame from "./selfGame";

export default ({ game, onSelectPlayer }) => {
  const [selfPlayer, ...otherPlayers] = game.players

  return <div className="flex flex-column content-end bg-light-silver h-100 w-40 pa2">
    {otherPlayers.map((player, i) => (
      <PlayerGame
        key={i} 
        player={player}
        onSelectPlayer={onSelectPlayer}
        active={player === game.currentPlayer}
      />
    ))}
    <SelfGame
      player={selfPlayer}
      onSelectPlayer={onSelectPlayer}
      active={selfPlayer === game.currentPlayer}
    />
  </div>
};
