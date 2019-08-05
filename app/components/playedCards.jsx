import React from "react";
import { range } from "lodash";
import Card from "./card";

const NCOLORS = 6;

export default () => (
  <div className="flex flex-row">
    {range(NCOLORS).map(i => (
      <Card key={i} size="large" />
    ))}
  </div>
);
