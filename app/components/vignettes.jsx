import React from "react";
import Vignette from "./vignette";

const number = 4;
const color = "yellow";

export default props => {
  return (
    <div>
      <div className="flex flex-row">
        <Vignette type="number" value="1" />
        <Vignette type="number" value="2" />
        <Vignette type="number" value="3" />
        <Vignette type="number" value="4" />
        <Vignette type="number" value="5" />
      </div>
      <div className="flex flex-row pt2">
        <Vignette type="color" value="white" />
        <Vignette type="color" value="red" />
        <Vignette type="color" value="yellow" />
        <Vignette type="color" value="blue" selected="true" />
        <Vignette type="color" value="green" />
        <Vignette type="color" value="multicolor" />
      </div>
    </div>
  );
};
