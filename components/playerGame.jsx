import React, { useEffect } from "react";
import Card, { CardContext } from "./card";
import { findLast } from "lodash";
import classnames from "classnames";

import { turnToText } from "../game/utils";
export default function PlayerGame(props) {
  const {
    game,
    player,
    active,
    self = false,
    onSelectPlayer,
    onNotifyPlayer
  } = props;
  const hand = player.hand || [];

  return (
    <div>
      <div
        className={classnames("f6 f4-l fw2 tracked ttu ml1", {
          "fw6 near-black": active,
          gray: !active
        })}
      >
        {active && "> "}
        {player.name} {self && "(you)"}
        {active && !self && !player.notified && (
          <span className="pointer" onClick={() => onNotifyPlayer(player)}>
            🔔
          </span>
        )}
      </div>
      <div
        className="f7 f6-l gray fw1 small"
        style={{ wordWrap: "break-word" }}
      >
        {turnToText(
          findLast(game.turnsHistory, a => a.action.from === player.index),
          game
        )}
      </div>

      <div className="cards dib mt2 mw-100">
        <div className="flex flex-row grow pointer">
          {hand.map((card, i) => (
            <Card
              onClick={() => onSelectPlayer(player, i)}
              key={i}
              card={card}
              position={i}
              hidden={self}
              multicolorOption={game.options.multicolor}
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
