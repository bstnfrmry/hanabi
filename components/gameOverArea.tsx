import React from "react";

import Txt from "~/components/ui/txt";

export default function GameOverArea() {
  return (
    <div className="pa1 bg-grey pt4 flex-grow-1">
      <Txt
        content={`The game is over! Your score is {game.playedCards.length} 🎉`}
      />
    </div>
  );
}
