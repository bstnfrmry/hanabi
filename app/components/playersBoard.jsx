import React from "react";
import PlayerGame from "./playerGame";

export default ({ game, onSelectPlayer }) => {
  const [selfPlayer, ...otherPlayers] = Object.values(game.players);

  return (
    <div className="flex flex-column h-100 overflow-y-scroll">
      <div className="flex-column pa2 pa4-l bg-gray-light">
        {otherPlayers.map((player, i) => (
          <div key={i} className="mb2 mb4-l">
            <PlayerGame
              player={player}
              onSelectPlayer={onSelectPlayer}
              active={player === game.currentPlayer}
            />
          </div>
        ))}
      </div>
      <div
        className="flex-grow-1 pa2 pa4-l bg-gray-light b--gray-light bt"
        style={{ marginTop: "auto" }}
      >
        <PlayerGame
          player={selfPlayer}
          self={true}
          onSelectPlayer={onSelectPlayer}
          active={selfPlayer === game.currentPlayer}
        />
      </div>
    </div>
  );
};
