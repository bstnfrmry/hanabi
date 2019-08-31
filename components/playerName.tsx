import classnames from "classnames";
import React from "react";

import Txt, { TxtSize } from "~/components/ui/txt";
import { IPlayer } from "~/game/state";
import { useSelfPlayer } from "~/hooks/game";

export enum PlayerNameSize {
  SMALL = "small",
  MEDIUM = "medium"
}

const PlayerNameTextSizes = {
  [PlayerNameSize.SMALL]: TxtSize.SMALL,
  [PlayerNameSize.MEDIUM]: TxtSize.MEDIUM
};

interface Props {
  player: IPlayer;
  size?: PlayerNameSize;
  explicit?: boolean;
  className?: string;
  reaction?: string;
}

export default function PlayerName(props: Props) {
  const {
    player,
    size = PlayerNameSize.SMALL,
    explicit = false,
    className,
    reaction
  } = props;

  const selfPlayer = useSelfPlayer();
  const you = !explicit && player === selfPlayer;

  return (
    <div className={classnames("relative inline-flex items-center", className)}>
      <Txt
        uppercase
        className="truncate"
        size={PlayerNameTextSizes[size]}
        value={`${player.emoji}${you ? "You" : player.name}`}
      />
      {reaction && (
        <div>
          <Txt
            className="ml2 absolute top-0"
            size={PlayerNameTextSizes[size]}
            style={{
              animation: "FontPulse 600ms 5"
            }}
            value={reaction}
          />
        </div>
      )}
    </div>
  );
}
