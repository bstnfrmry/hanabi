import React from "react";
import classnames from "classnames";

import Hint from "./hint";

// Cards possible sizes
const SizeMap = {
  tiny: "", // TODO h0 doesnt exist
  small: "h1 w1 h2-l w2-l",
  medium: "h2 w2 h3-l w3-l",
  large: "h3 w3 h4-l w4-l",
  extralarge: "h4 w4 h5-l w5-l"
};

export const PositionMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E"
};

export const CardContext = {
  SELF_PLAYER: "selfPlayer",
  OTHER_PLAYER: "otherPlayer",
  TARGETED_PLAYER: "targetedPlayer",
  PLAYED: "played"
};

export function CardWrapper(props) {
  const {
    color,
    size = "medium",
    playable = false,
    className = "",
    borderWidth = "",
    style = {},
    onClick,
    children
  } = props;

  const sizeClass = SizeMap[size];

  return (
    <div
      onClick={onClick}
      children={children}
      style={style}
      className={[
        "relative flex items-center justify-center br1 ba",
        sizeClass,
        className,
        borderWidth,
        `bg-${color}`,
        `b--${color}`,
        ...(playable ? ["pointer", "grow"] : [])
      ].join(" ")}
    />
  );
}

export default function Card(props) {
  const {
    card,
    context,
    onClick = () => {},
    hidden = false,
    playable = true,
    size = "medium",
    className = "",
    style = {},
    position = null,
    selected = false
  } = props;

  const color = hidden ? "main" : card.color;

  const number = hidden ? null : card.number;

  const displayHints = [
    CardContext.TARGETED_PLAYER,
    CardContext.SELF_PLAYER
  ].includes(context);

  return (
    <CardWrapper
      style={style}
      color={color}
      size={size}
      borderWidth={selected ? "bw2" : ""}
      playable={playable}
      className={className}
      style={style}
      onClick={onClick}
    >
      <div className={classnames("f2 f1-l fw3", { mb4: displayHints })}>
        {number}
      </div>
      {position >= 0 && (
        <div
          className={classnames(
            "absolute left-0 top-0 ma1 fw1",
            { white: hidden },
            { "dark-gray": !hidden }
          )}
        >
          {PositionMap[position]}
        </div>
      )}
      {displayHints && (
        <div className="absolute right-0 bottom-0 pa1 fw1 flex flex-column bg-black-30">
          <div className="flex white">
            {Object.keys(card.hint.color)
              .filter(c => c !== "multicolor")
              .map(color => {
                const hint = card.hint.color[color];

                return <Hint type="color" value={color} hint={hint} />;
              })}
          </div>
          <div className="flex mt1">
            {Object.keys(card.hint.number)
              .slice(1)
              .map(number => {
                const hint = card.hint.number[number];

                return <Hint type="number" value={number} hint={hint} />;
              })}
          </div>
        </div>
      )}
    </CardWrapper>
  );
}
