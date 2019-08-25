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
    <div>
      <div
        className={classnames("f6 f4-l fw2 tracked ttu ml1 flex items-center", {
          "fw6 near-black": active,
          gray: !active
        })}
      >
        {active && <span>>&nbsp;</span>}
        <PlayerName player={player} />
        {active && !self && !player.notified && (
          <span className="ml2 pointer" onClick={() => onNotifyPlayer(player)}>
            🔔
          </span>
        )}
      </div>

      <div className="cards dib mt2 mw-100">
        <div className="flex flex-row grow pointer">
          <PoseGroup>
            {hand.map((card, i) => (
              <CardAnimationWrapper key={card.id}>
                <Card
                  onClick={e => {
                    e.stopPropagation();
                    onSelectPlayer(player, i);
                  }}
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
        .cards:hover {
          background-color: #fffceb;
          box-shadow: 0px 0px 10px 5px #fffceb;
        }
      `}</style>
    </div>
  );
}
