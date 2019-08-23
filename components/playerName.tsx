import { IPlayer } from "../game/state";

interface IPlayerName {
  player: IPlayer;
}

export default function PlayerName(props: IPlayerName) {
  const { player } = props;

  return (
    <div className="inline-flex items-center">
      <span>{player.emoji}</span>
      <span>{player.name}</span>
    </div>
  );
}
