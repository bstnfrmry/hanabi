import React from "react";

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
    children
  } = props;

  const sizeClass = SizeMap[size];

  return (
    <div
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
    hint,
    hidden = false,
    playable = true,
    size = "medium",
    className = "",
    style = {},
    position = null,
    hintable = false
  } = props;

  const color = hidden ? "gray-light" : card.color;

  const number = hidden ? null : card.number;

  const displayHints = context === CardContext.OTHER_PLAYER;

  return (
    <CardWrapper
      style={style}
      color={color}
      size={size}
      borderWidth={hintable ? "bw2" : ""}
      playable={playable}
      className={className}
      style={style}
    >
      <div className="f2 f1-l fw3">{number}</div>
      {position >= 0 && (
        <div className="absolute left-0 top-0 ma1 fw1">
          {PositionMap[position]}
        </div>
      )}
      {displayHints && (
        <div className="absolute right-0 bottom-0 ma1 fw1 flex">
          {/* {JSON.stringify(hint.number)}
          {JSON.stringify(hint.color)} */}
        </div>
      )}
    </CardWrapper>
  );
}
