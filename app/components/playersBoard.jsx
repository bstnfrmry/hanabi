import React from "react";
import { range } from "lodash";
import PlayerGame from "./playerGame";
import SelfGame from "./selfGame";

const NPLAYERS = 5;

export default () => (
  <div className="flex flex-column content-end bg-green h-100 w-40 pa2">
    {range(NPLAYERS - 1).map(i => (
      <PlayerGame key={i} />
    ))}
    <SelfGame />
  </div>
);
