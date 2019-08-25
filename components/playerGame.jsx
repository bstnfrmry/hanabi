import React from "react";
import Button from "./button";
import classnames from "classnames";
import posed, { PoseGroup } from "react-pose";

import PlayerName from "./playerName";
import Card, { CardContext } from "./card";

const CardAnimationWrapper = posed.div({
  enter: { opacity: 1, y: 0, transition: { duration: 1000 } },
  exit: { opacity: 0, y: 10000, transition: { duration: 1000 } }
});

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
    <div
      className={classnames("container bg-temple pa2 shadow-5 br2", {
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

      <div className="flex justify-center mt2 w-100">
        <div className="flex flex-row pointer grow">
          <PoseGroup>
            {hand.map((card, i) => (
              <CardAnimationWrapper key={card.id}>
                <Card
                  onClick={() => onSelectPlayer(player, i)}
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
              </CardAnimationWrapper>
            ))}
          </PoseGroup>
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
