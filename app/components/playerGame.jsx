import React from "react";
import Card, { CardContext } from "./card";

export default ({ player, active, onSelectPlayer }) => (
  <div onClick={() => onSelectPlayer(player)}>
    <div className="flex flex-row justify-between pb1">
      <div className="b">{player.name} {active && '*'}</div>
      <div className="gray">played 2 Blue</div>
    </div>
    <div className="flex flex-row">
      {player.hand.map((card, i) => (
        <Card
          key={i}
          card={card}
          size="large"
          context={CardContext.OTHER_PLAYER}
        />
      ))}
    </div>
  </div>
);
