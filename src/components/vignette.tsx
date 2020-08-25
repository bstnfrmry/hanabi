import classnames from "classnames";
import React from "react";

import ColorSymbol from "~/components/colorSymbol";
import Txt from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { GameVariant, IColor, IHintType } from "~/lib/state";

interface Props {
  type: IHintType;
  value: string | number;
  className?: string;
  selected?: boolean;
  onClick?: Function;
}

export default function Vignette(props: Props) {
  const { type, value, onClick, className, selected = false } = props;

  const game = useGame();

  const displaySymbol = game.options.colorBlindMode && type === "color";

  const style = {
    ...(selected && { transform: "scale(1.2)" }),
  };

  return (
    <a
      className={classnames(
        className,
        "outline-main-dark ba pointer flex items-center justify-center mr1 mr2-l br-100 h2 w2 grow border-box",
        { [`bg-${value} b--${value}`]: type === "color" },
        { "bg-main-dark b-gray-light": type === "number" },
        { bw1: selected }
      )}
      id={`hint-${type}-${value}`}
      style={style}
      onClick={() => onClick && onClick({ type, value })}
    >
      {displaySymbol && <ColorSymbol color={value as IColor} />}
      {type === "number" && (
        <Txt value={game.options.variant === GameVariant.SEQUENCE && value < 5 ? `${value}+` : value} />
      )}
    </a>
  );
}
