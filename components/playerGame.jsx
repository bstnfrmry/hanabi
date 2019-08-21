import React from "react";
import Card, { CardContext } from "./card";
import { findLast } from "lodash";
import classnames from "classnames";

import { actionToText } from "../game/utils";

export default function PlayerGame(props) {
  const { game, player, active, self = false, onSelectPlayer } = props;
  const hand = player.hand || [];

  return (
    <div onClick={() => onSelectPlayer(player)}>
      <div
        className={classnames("f6 f4-l fw2 tracked ttu ml1", {
          "fw6 near-black": active,
          gray: !active
        })}
      >
        {active && "> "}
        {player.name} {self && "(you)"}
      </div>
      <div
        className="f7 f6-l gray fw1 small"
        style={{ wordWrap: "break-word" }}
      >
        {actionToText(
          findLast(game.actionsHistory, a => a.from === player.index),
          game
        )}
      </div>
      <div className="cards dib mt2">
        <div className="flex flex-row grow pointer">
          {hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              position={i}
              hidden={self}
              size="medium"
              context={
                self ? CardContext.SELF_PLAYER : CardContext.OTHER_PLAYER
              }
              className={i < player.hand.length - 1 ? "mr1 mr2-l" : ""}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .cards:hover {
          background-color: #fffceb;
          box-shadow: 0px 0px 10px 5px #fffceb;
        }
      `}</style>
    </div>
  );
}
