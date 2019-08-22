import React from "react";
import Vignette from "./vignette";
import { colors, numbers } from "../game/actions";

export default ({ onSelect, pendingHint, multicolorOption }) => {
  console.log(multicolorOption);
  return (
    <div>
      <div className="flex flex-row">
        {numbers.map(number => (
          <Vignette
            type="number"
            key={number}
            value={number}
            onClick={onSelect}
            selected={
              pendingHint.type === "number" && pendingHint.value === number
            }
          />
        ))}
      </div>
      <div className="flex flex-row pt2">
        {colors
          .filter(c => (multicolorOption ? true : c !== "multicolor"))
          .map((color, i) => (
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
