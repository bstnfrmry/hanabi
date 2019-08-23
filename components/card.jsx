import React from "react";
import classnames from "classnames";
import { colors, numbers } from "../game/actions";

import Hint from "./hint";

// Cards possible sizes
const SizeMap = {
  tiny: "", // TODO h0 doesnt exist
  small: "h1 w1 h2-l w2-l f5 f4-l",
  medium: "h2 w2 h4-l w4-l f4 f1-l",
  large: "h4 w4 mw4 f2 f1-l",
  extralarge: "h4 w4 mw4 h5-l w5-l f2 f1-l"
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
    context,
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
      className={classnames(
        "relative flex items-center justify-center br1 ba",
        sizeClass,
        className,
        borderWidth,
        `bg-${color}`,
        { pointer: playable },
        { grow: context === CardContext.TARGETED_PLAYER }
      )}
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
    selected = false,
    multicolorOption = false
  } = props;

  const color = hidden ? "light-silver" : card.color;

  const number = hidden ? null : card.number;

  const displayHints = [
    CardContext.OTHER_PLAYER, // Todo: remove other when mobile (removing hints due to lack of space)
    CardContext.TARGETED_PLAYER,
    CardContext.SELF_PLAYER
  ].includes(context);

  if (selected) {
    style.transform = "scale(1.20)";
  }

  return (
    <CardWrapper
      style={style}
      color={color}
      context={context}
      size={size}
      borderWidth={selected ? "bw2 z-5" : ""}
      playable={playable}
      className={className}
      style={style}
      onClick={onClick}
    >
      <div
        className={classnames("gray", {
          f7: size === "small"
        })}
      >
        {number}
      </div>
      {position >= 0 && size.includes("large") && (
        <div
          className={classnames("absolute left-0 top-0 ma1 fw1 f3 black-50")}
        >
          {PositionMap[position]}
        </div>
      )}
      {/* show positive hints with a larger type*/}
      {displayHints && hidden && (
        <div
          className={classnames(
            "absolute top-0 mt2 fw3 br-100 w-50 h-50 flex justify-center items-center",
            {
              [`bg-${card.color}`]: card.hint.color[card.color] === 2
            }
          )}
        >
          {card.hint.number[card.number] === 2 ? card.number : null}
        </div>
      )}
      {/* show other hints, including negative hints */}
      {displayHints && (size.includes("large") || size === "medium") && (
        <div
          className={classnames(
            "absolute w-100 right-0 bottom-0 pv1 f5 fw1 flex-l items-center flex-column bg-black-50",
            {
              dn: size === "medium" || size === "small",
              flex: size.includes("large")
            }
          )}
        >
          <div className="flex justify-around w-100 white">
            {colors
              .filter(c => (multicolorOption ? true : c !== "multicolor"))
              .map(color => {
                const hint = card.hint.color[color];

                return (
                  <Hint key={color} type="color" value={color} hint={hint} />
                );
              })}
          </div>
          <div className="flex justify-around w-100 white mt1">
            {numbers.map(number => {
              const hint = card.hint.number[number];

              return (
                <Hint key={number} type="number" value={number} hint={hint} />
              );
            })}
          </div>
        </div>
      )}
    </CardWrapper>
  );
}
