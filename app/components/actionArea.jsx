import React from "react";
import Card, { CardContext } from "./card";
import Vignettes from "./vignettes";

export default ({ game, selectedPlayer }) => {
  if (!selectedPlayer) {
    return <div className="flex-grow-1">Select a player</div>
  }

  return <div className="pa2 bg-light-gray flex flex-column flex-grow-1">
    <div className="flex flex-row w-100 pb2">{selectedPlayer.name}'s game</div>
    <div className="flex flex-row w-100 pb2">
      {selectedPlayer.hand.map((card, i) => (
        <Card
          key={i}
          card={card}
          position={i}
          size="extralarge"
          context={CardContext.OTHER_PLAYER}
          className="ma1"
        />
      ))}
    </div>
    <div className="flex flex-row w-100 pb2">Select a hint below</div>
    <div className="flex flex-row w-100 pb2">
      <Vignettes colors={game.colors} values={game.values} className="flex flex-grow-1" />
      <button className="ba br1 pointer">Give hint</button>
    </div>
  </div>
};
