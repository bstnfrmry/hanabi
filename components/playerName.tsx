import classnames from "classnames";

import { IPlayer } from "~/game/state";
import { useSelfPlayer } from "~/hooks/game";

interface Props {
  player: IPlayer;
  explicit?: boolean;
  className?: string;
}

export default function PlayerName(props: Props) {
  const { player, explicit = false, className } = props;

  const selfPlayer = useSelfPlayer();

  return (
    <div className={classnames("inline-flex items-center", className)}>
      <span>{player.emoji}&nbsp;</span>
      <span className="truncate">
        {!explicit && player === selfPlayer ? "You" : player.name}
      </span>
    </div>
  );
}
