import React from "react";
import Vignette from "./vignette";

export default ({ values, colors, onSelect, pendingAction }) => {
  return (
    <div>
      <div className="flex flex-row">
        {values.map(value => (
          <Vignette
            type="number"
            key={value}
            value={value}
            onClick={onSelect}
            selected={
              pendingAction.type === "number" && pendingAction.value === value
            }
          />
        ))}
      </div>
      <div className="flex flex-row pt2">
        {colors.map((color, i) => (
          <Vignette
            type="color"
            key={i}
            value={color}
            onClick={onSelect}
            selected={
              pendingAction.type === "color" && pendingAction.value === color
            }
          />
        ))}
      </div>
    </div>
  );
};
