import React, { ReactNode, MouseEvent, CSSProperties } from "react";
import classnames from "classnames";

import { ICard } from "~/game/state";
import { numbers, getColors } from "~/game/actions";
import { useGame } from "~/hooks/game";

import Hint from "~/components/hint";

export enum CardSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

// Cards possible sizes
const SizeMap = {
  [CardSize.SMALL]: "h1.5 w1.5 h2-l w2-l f5 f3-l",
  [CardSize.MEDIUM]: "h2 w2 h4-l w4-l f4 f2-l",
  [CardSize.LARGE]: "h3 w3 h4.5-l w4.5-l f3 f1-l"
};

export const PositionMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E"
};

export enum ICardContext {
  SELF_PLAYER,
  OTHER_PLAYER,
  TARGETED_PLAYER,
  PLAYED,
  DISCARDED,
  DRAWN
}

interface CardWrapperProps {
  color: string;
  size?: CardSize;
  playable?: boolean;
  context?: ICardContext;
  className?: string;
  borderWidth?: string;
  style?: CSSProperties;
  onClick?: (MouseEvent) => void;
  children?: ReactNode;
}

export function CardWrapper(props: CardWrapperProps) {
  const {
    color,
    size = CardSize.MEDIUM,
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
        { "shadow-2": size.includes("large") },
        { "shadow-1": size.includes("medium") },
        { pointer: playable },
        { grow: context === ICardContext.TARGETED_PLAYER }
      )}
    />
  );
}

interface Props {
  card: ICard;
  context: ICardContext;
  hidden?: boolean;
  position?: number;
  selected?: boolean;
  playable?: boolean;
  size?: CardSize;
  className?: string;
  style?: CSSProperties;
  onClick?: (MouseEvent) => void;
}

export default function Card(props: Props) {
  const {
    card,
    context,
    onClick = () => {},
    hidden = false,
    playable = true,
    size = CardSize.MEDIUM,
    className = "",
    style = {},
    position = null,
    selected = false
  } = props;

  const game = useGame();
  const colors = getColors(game);
  const color = hidden ? "light-silver" : card.color;

  const number = hidden ? null : card.number;

  const displayHints = [
    ICardContext.OTHER_PLAYER, // Todo: remove other when mobile (removing hints due to lack of space)
    ICardContext.TARGETED_PLAYER,
    ICardContext.SELF_PLAYER
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
      borderWidth={selected ? "bw1 z-5" : ""}
      playable={playable}
      className={className}
      onClick={onClick}
    >
      <div
        className={classnames(
          "white outline-main-dark",
          { f7: size === "small" },
          { mb3: size.includes("large") },
          { "mb4-l": size === "medium" }
        )}
      >
        {number}
      </div>
      {position >= 0 && size.includes("large") && (
        <div
          className={classnames("absolute left-0 top-0 ma1 fw1 f6 black-20")}
        >
          {PositionMap[position]}
        </div>
      )}
      {/* show positive hints with a larger type*/}
      {displayHints && hidden && (
        <div
          className={classnames(
            "absolute top-0 mt2 fw3 br-100 w-50 h-50 flex justify-center items-center",
            { [`bg-${card.color}`]: card.hint.color[card.color] === 2 },
            { mt3: size.includes("large") }
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
            {colors.map(color => {
              const hint = card.hint.color[color];

              return (
                <Hint key={color} type="color" value={color} hint={hint} />
              );
            })}
          </div>
          <div
            className="flex justify-around white mt1 mt2-l"
            style={{ width: `${(numbers.length / colors.length) * 100}%` }}
          >
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
