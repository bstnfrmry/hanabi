import classnames from "classnames";
import React, { useState } from "react";
import Popover from "react-popover";

import Card, { CardSize, ICardContext } from "~/components/card";
import PlayerName from "~/components/playerName";
import ReactionsPopover from "~/components/reactionsPopover";
import Txt from "~/components/ui/txt";
import { IPlayer } from "~/game/state";
import { useSelfPlayer } from "~/hooks/game";

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
  const selfPlayer = useSelfPlayer();
  const hideCards = self || !selfPlayer;

  return (
    <div
      className={classnames(
        "flex w-100 flex-column justify-center bg-main-dark pa2 pv4-l ph3-l br3 relative",
        {
          "b--yellow border-box ba bw2": active
        }
      )}
    >
      <div className="ml1 flex items-center">
        <PlayerName
          className="w-100"
          explicit={true}
          player={player}
          reaction={player.reaction}
        />
        {active && !self && !player.notified && !player.bot && (
          <a
            className="absolute right-0 mr1 mr4-l"
            onClick={() => onNotifyPlayer(player)}
          >
            <Txt value="🔔" />
          </a>
        )}
        {self && (
          <>
            <Popover
              body={
                <ReactionsPopover
                  onClose={() => setReactionsOpen(false)}
                  onReaction={onReaction}
                />
              }
              className="z-999"
              isOpen={reactionsOpen}
              onOuterAction={() => setReactionsOpen(false)}
            >
              <a
                className="absolute right-0 mr1 mr4-l"
                onClick={() => setReactionsOpen(!reactionsOpen)}
              >
                <Txt value="👍" />
              </a>
            </Popover>
          </>
        )}
      </div>

      <div className="cards dib mt2">
        <div className="flex flex-row justify-center grow pointer ph2">
          {player.hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              className={classnames({
                "mr1 mr2-l": i < player.hand.length - 1
              })}
              context={
                self ? ICardContext.SELF_PLAYER : ICardContext.OTHER_PLAYER
              }
              hidden={hideCards}
              position={i}
              size={CardSize.MEDIUM}
              onClick={() => onSelectPlayer(player, i)}
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
    </div>
  );
}
