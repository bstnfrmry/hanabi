import React from "react";
import Card from "./card";

export default ({ player, active, onSelectPlayer }) => (
  <div onClick={() => onSelectPlayer(null)} style={{ marginTop: "auto" }}>
    <div className="b">You {active && '*'}</div>
    <div className="flex flex-row">
      {player.hand.map((card, i) => (
        <Card
          key={i}
          card={card}
          hidden
          size="large"
          className="ma1"
        />
      ))}
    </div>
  </div>
);
