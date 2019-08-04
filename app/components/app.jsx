import React from "react";
import PlayersBoard from "./playersBoard";
import GameBoard from "./gameBoard";
import ActionArea from "./actionArea";

export default () => (
  <div className="flex flex-row w-100 h-100">
    <PlayersBoard />
    <div className="flex flex-column h-100 flex-grow-1">
      <GameBoard />
      <ActionArea />
    </div>
  </div>
);
