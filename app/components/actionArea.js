import React from "react";
import { range } from "lodash";
import Card from "./card";
import Vignettes from "./vignettes";

const NCOLORS = 5;

export default () => (
  <div className="pa2 bg-light-gray flex flex-column flex-grow-1">
    <div className="flex flex-row w-100 pb2">Miho's game</div>
    <div className="flex flex-row w-100 pb2">
      {range(NCOLORS).map(i => (
        <Card key={i} size="extralarge" />
      ))}
    </div>
    <div className="flex flex-row w-100 pb2">Select a hint below</div>
    <div className="flex flex-row w-100 pb2">
      <Vignettes className="flex flex-grow-1" />
      <button className="ba br1 pointer">Give hint</button>
    </div>
  </div>
);
