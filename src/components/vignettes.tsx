import React from "react";

import Vignette from "~/components/vignette";
import { useGame } from "~/hooks/game";
import { getHintableColors, numbers } from "~/lib/actions";
import { GameVariant, IHintAction } from "~/lib/state";

interface Props {
  onSelect: (action: IHintAction) => void;
  pendingHint: IHintAction;
}

export default function Vignettes(props: Props) {
  const { onSelect, pendingHint } = props;

  const game = useGame();
  const colors = getHintableColors(game);

  const hintableNumbers = game.options.variant === GameVariant.SEQUENCE ? numbers.slice(1) : numbers;

  return (
    <div className="flex flex-column items-center ml6-l">
      <div className="flex flex-row mb1">
        {colors.map((color, i) => (
          <Vignette
            key={i}
            selected={pendingHint.type === "color" && pendingHint.value === color}
            type="color"
            value={color}
            onClick={onSelect}
          />
        ))}
      </div>
      <div
        className="flex flex-row justify-around"
        style={{ width: `${(hintableNumbers.length / colors.length) * 100}%` }}
      >
        {hintableNumbers.map(number => (
          <Vignette
            key={number}
            selected={pendingHint.type === "number" && pendingHint.value === number}
            type="number"
            value={number}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
