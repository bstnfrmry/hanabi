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
      /* Background Colors */

      .bg-hanabi-white {
        background-color: #f4f6f7;
      }
      .bg-hanabi-red {
        background-color: #ec7063;
      }
      .bg-hanabi-blue {
        background-color: #5dade2;
      }
      .bg-hanabi-yellow {
        background-color: #f4d03f;
      }
      .bg-hanabi-green {
        background-color: #52be80;
      }
      .bg-hanabi-multicolor {
        background-color: #af7ac5;
      }

      /* Colors */
      .hanabi-white {
        color: #f4f6f7;
      }
      .hanabi-red {
        color: #ec7063;
      }
      .hanabi-blue {
        color: #5dade2;
      }
      .hanabi-yellow {
        color: #f4d03f;
      }
      .hanabi-green {
        color: #52be80;
      }
      .hanabi-multicolor {
        color: #af7ac5;
      }
    `}</style>
  </div>
);
