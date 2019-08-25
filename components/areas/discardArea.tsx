import { useGame } from "~/hooks/game";

import DiscardPile from "~/components/discardPile";

export default function DiscardArea() {
  const game = useGame();

  return (
    <div className="flex flex-column flex-grow-1">
      <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1">
        Discarded cards
      </div>
      <DiscardPile cards={game.discardPile} />
    </div>
  );
}
