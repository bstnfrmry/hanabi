import React from "react";
import { range } from "lodash";
import Card from "./card";

const NCARDS = 5;

export default () => (
  <div style={{ marginTop: "auto" }}>
    <div className="b">You</div>
    <div className="flex flex-row">
      {range(NCARDS).map(i => (
        <Card key={i} large={true}/>
      ))}
    </div>
  </div>
);
