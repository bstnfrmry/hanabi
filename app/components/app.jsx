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
    <style global jsx>{`
      body {
        background: black;
      }

      .bg-hanabi-white {
        background-color: white;
      }
      .bg-hanabi-red {
        background-color: red;
      }
      .bg-hanabi-blue {
        background-color: blue;
      }
      .bg-hanabi-yellow {
        background-color: yellow;
      }
      .bg-hanabi-green {
        background-color: green;
      }
      .bg-hanabi-multicolor {
        background-color: purple;
      }
    `}</style>
  </div>
);
