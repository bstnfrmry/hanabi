import React from "react";

import Txt from "~/components/ui/txt";
import { useGame } from "~/hooks/game";

export default function GameOverArea() {
  const game = useGame();

  return (
    <div className="pa1 bg-grey pt4 flex-grow-1">
      <Txt
        value={`The game is over! Your score is ${game.playedCards.length} 🎉`}
      />
    </div>
  );
}
