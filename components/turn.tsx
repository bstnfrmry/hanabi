import IGameState, { ITurn } from "../game/state";
import PlayerName from "./playerName";
import Card from "./card";
import Hint from "./hint";

interface TurnProps {
  game: IGameState;
  turn: ITurn;
  includePlayer: boolean;
  showDrawn: boolean;
}

export default function Turn(props: TurnProps) {
  const { game, turn, includePlayer = false, showDrawn } = props;

  if (!turn) {
    return null;
  }

  return (
    <div className="inline-flex items-center">
      {includePlayer && <PlayerName player={game.players[turn.action.from]} />}

      {turn.action.action === "hint" && (
        <div className="ml1 inline-flex items-center">
          hinted&nbsp;
          <PlayerName player={game.players[turn.action.to]} />
          &nbsp;about&nbsp;
          <Hint type={turn.action.type} value={turn.action.value} hint={2} />
          {turn.action.type === "color" ? " cards" : "s"}
        </div>
      )}

      {turn.action.action === "discard" && (
        <div className="ml1 inline-flex items-center">
          discarded&nbsp;
          <Card card={turn.action.card} size="small" />
        </div>
      )}

      {turn.action.action === "play" && (
        <div className="ml1 inline-flex items-center">
          played&nbsp;
          <Card card={turn.action.card} size="small" />
        </div>
      )}

      {showDrawn && turn.card && (
        <div className="ml1 inline-flex items-center">
          & drew&nbsp;
          <Card card={turn.card} size="small" />
        </div>
      )}
    </div>
  );
}
