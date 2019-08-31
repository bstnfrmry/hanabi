import React from "react";
import classnames from "classnames";

import { IPlayer } from "~/game/state";
import { useSelfPlayer } from "~/hooks/game";

interface Props {
  player: IPlayer;
  explicit?: boolean;
  className?: string;
  reaction?: string;
}

export default function PlayerName(props: Props) {
  const { player, explicit = false, className, reaction } = props;

  const selfPlayer = useSelfPlayer();

  return (
    <div className={classnames("relative inline-flex items-center", className)}>
      <span>{player.emoji}&nbsp;</span>
      <span className="truncate">
        {!explicit && player === selfPlayer ? "You" : player.name}
      </span>
      <div className="ml2">
        {reaction && (
          <span
            className="absolute top-0"
            style={{
              animation: "FontPulse 600ms 5"
            }}
          >
            {reaction}
          </span>
        )}
      </div>
    </div>
  );
}
