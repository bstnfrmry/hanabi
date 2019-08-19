import React from "react";
import Card, { CardContext } from "./card";

export default function PlayerGame(props) {
  const { player, active, self = false, onSelectPlayer } = props;
  const hand = player.hand || [];

  return (
    <div onClick={() => onSelectPlayer(player)}>
      <div className="flex flex-row">
        {hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            position={i}
            hidden={self}
            size="large"
            context={CardContext.OTHER_PLAYER}
            className={i < player.hand.length - 1 ? "mr1 mr2-l" : ""}
          />
        ))}
      </div>
      <div className="flex flex-row justify-between items-end mt2">
        <div
          className={[
            "f6 f4-l fw2 tracked ttu ml1 gray",
            ...(active ? ["fw5"] : [])
          ].join(" ")}
        >
          {player.name} {self && "(you)"}
        </div>
        <div className="f6 f4-l gray fw1 tracked ttu">played 2 Blue</div>
      </div>
    </div>
  );
}
