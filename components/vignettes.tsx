import React from "react";

import Vignette from "~/components/vignette";
import { getColors, numbers } from "~/game/actions";
import { IHintAction } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  onSelect: (action: IHintAction) => void;
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
            key={i}
            selected={
              pendingHint.type === "color" && pendingHint.value === color
            }
            type="color"
            value={color}
            onClick={onSelect}
          />
        ))}
      </div>
      <div
        className="flex flex-row justify-around"
        style={{ width: `${(numbers.length / colors.length) * 100}%` }}
      >
        {numbers.map(number => (
          <Vignette
            key={number}
            selected={
              pendingHint.type === "number" && pendingHint.value === number
            }
            type="number"
            value={number}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
