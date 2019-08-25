import { IPlayer } from "~/game/state";

interface Props {
  player: IPlayer;
}

export default function PlayerName(props: Props) {
  const { player } = props;

  return (
    <div className="inline-flex items-center nowrap">
      <span>{player.emoji}</span>
      <span>{player.name}</span>
    </div>
  );
}
