import classnames from "classnames";
import React, { HTMLAttributes, useState } from "react";
import Popover from "react-popover";

import Card, { CardSize, ICardContext } from "~/components/card";
import PlayerName, { PlayerNameSize } from "~/components/playerName";
import ReactionsPopover from "~/components/reactionsPopover";
import Txt from "~/components/ui/txt";
import { IGameStatus, IPlayer } from "~/game/state";
import { useGame, useSelfPlayer } from "~/hooks/game";

interface Props extends HTMLAttributes<HTMLElement> {
  player: IPlayer;
  interturn: boolean;
  active?: boolean;
  self?: boolean;
  onSelectPlayer: Function;
  onNotifyPlayer?: Function;
  onReaction?: Function;
}

export default function PlayerGame(props: Props) {
  const {
    player,
    interturn,
    self = false,
    onSelectPlayer,
    onNotifyPlayer,
    onReaction,
    active,
    ...attributes
  } = props;

  const game = useGame();
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const selfPlayer = useSelfPlayer();
  const hideCards =
    interturn ||
    game.status === IGameStatus.LOBBY ||
    (game.status !== IGameStatus.OVER && (self || !selfPlayer));

  return (
    <div
      className={classnames(
        "cards flex justify-between bg-main-dark pa2 pv3 relative"
      )}
      onClick={() => onSelectPlayer(player, 0)}
      {...attributes}
    >
      <div className="flex items-center">
        <PlayerName
          className="mr2"
          explicit={true}
          player={player}
          size={PlayerNameSize.MEDIUM}
        />

        {!self && player.reaction && (
          <Txt
            style={{
              animation: "FontPulse 600ms 5"
            }}
            value={player.reaction}
          />
        )}
        {self && (
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
              className="pointer grow☺"
              onClick={() => setReactionsOpen(!reactionsOpen)}
            >
              {player.reaction && (
                <Txt
                  style={{
                    animation: "FontPulse 600ms 5"
                  }}
                  value={player.reaction}
                />
              )}
              {!player.reaction && (
                <Txt style={{ filter: "grayscale(100%)" }} value="︎︎︎︎😊" />
              )}
            </a>
          </Popover>
        )}
        {active && !self && !player.notified && !player.bot && (
          <a
            className="absolute right-0 mr1 mr4-l"
            onClick={() => onNotifyPlayer(player)}
          >
            <Txt value="🔔" />
          </a>
        )}
      </div>

      <div className="flex justify-end flex-grow-1 dib">
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
            onClick={e => {
              e.stopPropagation();
              onSelectPlayer(player, i);
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .cards:hover {
          background-color: var(--color-yellow);
        }
      `}</style>
    </div>
  );
}
