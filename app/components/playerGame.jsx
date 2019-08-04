import React from "react";
import { range } from "lodash";
import Card from "./card";

const NCARDS = 5;

export default () => (
  <div>
    <div className="flex flex-row justify-between pb1">
      <div className="b">Akiyo</div>
      <div className="gray">played 2 Blue</div>
    </div>
    <div className="flex flex-row">
      {range(NCARDS).map(i => (
        <Card key={i} />
      ))}
    </div>
  </div>
);
