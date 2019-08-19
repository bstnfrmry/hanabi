import React from "react";
import Vignette from "./vignette";

export default ({ values, colors, onSelect, pendingHint }) => {
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
              pendingHint.type === "number" && pendingHint.value === value
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
              pendingHint.type === "color" && pendingHint.value === color
            }
          />
        ))}
      </div>
    </div>
  );
};
