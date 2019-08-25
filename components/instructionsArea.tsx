import { useGame, useSelfPlayer, useCurrentPlayer } from "~/hooks/game";

import PlayerName from "~/components/playerName";
import Turn from "~/components/turn";

export default function InstructionsArea() {
  const game = useGame();
  const selfPlayer = useSelfPlayer();
  const currentPlayer = useCurrentPlayer();
  const isCurrentPlayer = currentPlayer === selfPlayer;

  return (
    <div className="flex-grow-1 f6 f4-l fw2 lh-copy">
      {!isCurrentPlayer && (
        <div className="ttu tracked">
          It's <PlayerName player={currentPlayer} />
          's turn
        </div>
      )}
      {isCurrentPlayer && (
        <div className="ttu tracked">
          <div>Your turn!</div>
          <div>Give a hint by tapping on your playmates' hand</div>
          <div>Play or discard by tapping on your own game</div>
        </div>
      )}
      {game.turnsHistory.length > 0 && (
        <div className="ttu tracked mt3">Last actions:</div>
      )}
      {[...game.turnsHistory].reverse().map((turn, i) => {
        return (
          <div key={i} className="mt1">
            <Turn
              turn={turn}
              includePlayer={true}
              showDrawn={game.players[turn.action.from] !== selfPlayer}
            />
          </div>
        );
      })}
    </div>
  );
}
