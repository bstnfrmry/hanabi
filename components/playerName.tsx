import { IPlayer } from "~/game/state";
import { useSelfPlayer } from "~/hooks/game";

interface Props {
  player: IPlayer;
  explicit?: boolean;
}

export default function PlayerName(props: Props) {
  const { player, explicit = false } = props;

  const selfPlayer = useSelfPlayer();

  return (
    <div className="inline-flex items-center nowrap">
      <span>{player.emoji}&nbsp;</span>
      <span>{!explicit && player === selfPlayer ? "You" : player.name}</span>
    </div>
  );
}
