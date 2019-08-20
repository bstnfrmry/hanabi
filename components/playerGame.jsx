import React from "react";
import Card, { CardContext } from "./card";
import { findLast } from "lodash";
import classnames from "classnames";

export default function PlayerGame(props) {
  const { game, player, active, self = false, onSelectPlayer } = props;
  const hand = player.hand || [];

  return (
    <div onClick={() => onSelectPlayer(player)}>
      <div className="flex flex-row justify-between items-end mb2">
        <div
          className={classnames("f6 f4-l fw2 tracked ttu ml1", {
            "fw6 dark-gray": active,
            gray: !active
          })}
        >
          {active && "> "}
          {player.name} {self && "(you)"}
          {active && " <"}
        </div>
        <div className="f7 f6-l gray fw1 tracked ttu tr">
          {actionToText(
            findLast(game.actionsHistory, a => a.from === player.index),
            game
          )}
        </div>
      </div>
      <div className="flex flex-row">
        {hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            position={i}
            hidden={self}
            size="large"
            context={self ? CardContext.SELF_PLAYER : CardContext.OTHER_PLAYER}
            className={i < player.hand.length - 1 ? "mr1 mr2-l" : ""}
          />
        ))}
      </div>
    </div>
  );
}

function actionToText(action, game) {
  if (!action) {
    return "";
  } else if (action.action === "hint") {
    return `gave a hint to ${game.players[action.to].name} about their ${action.value} card(s).`;
  } else if (action.action === "discard") {
    return `discarded ${action.card.number} ${action.card.color}`;
  } else if (action.action === "play") {
    return `played ${action.card.number} ${action.card.color}`;
  }
}
