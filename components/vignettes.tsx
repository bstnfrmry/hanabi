import React from "react";

import Vignette from "~/components/vignette";
import { getColors, numbers } from "~/game/actions";
import { IHintAction } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  onSelect: Function;
  pendingHint: IHintAction;
}

export default function Vignettes(props: Props) {
  const { onSelect, pendingHint } = props;

  const game = useGame();
  const colors = getColors(game);

  return (
    <div className="flex flex-column items-center">
      <div className="flex flex-row mb1 mb3-l">
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
      <div
        className="flex flex-row justify-around"
        style={{ width: `${(numbers.length / colors.length) * 100}%` }}
      >
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
    </div>
  );
}
