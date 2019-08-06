import React from "react";
import Vignette from "./vignette";

export default ({ values, colors }) => {
  return (
    <div>
      <div className="flex flex-row">
        {values.map(value => <Vignette type="number" key={value} value={value} />)}
      </div>
      <div className="flex flex-row pt2">
        {colors.map((color, i) => <Vignette type="color" key={i} value={color} />)}
      </div>
    </div>
  );
};
