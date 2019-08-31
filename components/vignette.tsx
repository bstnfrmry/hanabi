import classnames from "classnames";
import React from "react";

import Txt from "~/components/ui/txt";
import { IHintType } from "~/game/state";

interface Props {
  type: IHintType;
  value: string | number;
  className?: string;
  selected?: boolean;
  onClick?: Function;
}

export default function Vignette(props: Props) {
  const { type, value, onClick, className, selected = false } = props;

  const style = {
    ...(selected && { transform: "scale(1.2)" })
  };

  return (
    <a
      className={classnames(
        className,
        "outline-main-dark ba pointer flex items-center justify-center mr1 mr3-l br-100 h2 w2 h3-l w3-l grow border-box",
        { [`bg-${value} b--${value}`]: type === "color" },
        { "bg-main-dark b-gray-light": type === "number" },
        { bw1: selected }
      )}
      style={style}
      onClick={() => onClick && onClick({ type, value })}
    >
      {type === "number" && <Txt value={value} />}
    </a>
  );
}
