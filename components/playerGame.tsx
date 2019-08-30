import React, { useState } from "react";
import Popover from "react-popover";
import classnames from "classnames";

import { IPlayer } from "~/game/state";

import PlayerName from "~/components/playerName";
import Card, { ICardContext, CardSize } from "~/components/card";
import Box from "~/components/ui/box";
import ReactionsPopover from "~/components/reactionsPopover";

interface Props {
  player: IPlayer;
  active?: boolean;
  self?: boolean;
  onSelectPlayer: Function;
  onNotifyPlayer?: Function;
  onReaction?: Function;
}

export default function PlayerGame(props: Props) {
  const {
    player,
    active,
    self = false,
    onSelectPlayer,
    onNotifyPlayer,
    onReaction
  } = props;

  const [reactionsOpen, setReactionsOpen] = useState(false);

  return (
    <Box
      className={classnames("relative", {
        "border-box ba bw2": active
      })}
      borderColor={active ? "yellow" : null}
    >
      <div className="f7 f3-l fw1 ttu ml1 flex items-center">
        <PlayerName
          player={player}
          explicit={true}
          reaction={player.reaction}
          className="w-100"
        />
        {active && !self && !player.notified && !player.bot && (
          <span
            className="absolute right-0 mr1 mr4-l"
            onClick={() => onNotifyPlayer(player)}
          >
            🔔
          </span>
        )}
        {self && (
          <>
            <Popover
              isOpen={reactionsOpen}
              onOuterAction={() => setReactionsOpen(false)}
              body={
                <ReactionsPopover
                  onReaction={onReaction}
                  onClose={() => setReactionsOpen(false)}
                />
              }
              className="z-999"
            >
              <span
                className="absolute right-0 mr1 mr4-l"
                onClick={() => setReactionsOpen(!reactionsOpen)}
              >
                👍
              </span>
            </Popover>
          </>
        )}
      </div>

      <div className="cards dib mt2 mw-100">
        <div className="flex flex-row grow pointer ph2">
          {player.hand.map((card, i) => (
            <Card
              key={i}
              onClick={() => onSelectPlayer(player, i)}
              card={card}
              position={i}
              hidden={self}
              size={CardSize.MEDIUM}
              context={
                self ? ICardContext.SELF_PLAYER : ICardContext.OTHER_PLAYER
              }
              className={classnames({
                "mr1 mr2-l": i < player.hand.length - 1
              })}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .cards:hover {
          background-color: var(--color-yellow);
          box-shadow: 0px 0px 5px 5px var(--color-yellow);
        }
      `}</style>
    </Box>
  );
}
