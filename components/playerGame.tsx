import React from "react";
import Button from "./button";
import classnames from "classnames";
import { IPlayer } from "../game/state";

import PlayerName from "~/components/playerName";
import Card, { CardContext } from "~/components/card";

interface IPlayerGame {
  player: IPlayer;
  active?: boolean;
  self?: boolean;
  onSelectPlayer: Function;
  onNotifyPlayer?: Function;
}

export default function PlayerGame(props: IPlayerGame) {
  const {
    player,
    active,
    self = false,
    onSelectPlayer,
    onNotifyPlayer
  } = props;

  return (
    <div
      className={classnames("container bg-main-dark pa2 shadow-5 br2", {
        "border-box ba bw2 b--yellow": active
      })}
    >
      <div
        className={classnames(
          "f6 f4-l fw1 tracked ttu ml1 flex items-center bg-wood"
        )}
      >
        <PlayerName player={player} />
        {active && !self && !player.notified && (
          <span className="ml2 pointer" onClick={() => onNotifyPlayer(player)}>
            🔔
          </span>
        )}
      </div>

      <div className="cards dib mt2 mw-100">
        <div className="flex flex-row grow pointer">
          {player.hand.map((card, i) => (
            <Card
              onClick={() => onSelectPlayer(player, i)}
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
        .container:hover {
          background-color: rgba(#f4d03f, 80%);
          box-shadow: 0px 0px 5px 2px var(--color-yellow);
        }
      `}</style>
    </div>
  );
}
