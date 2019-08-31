import classnames from "classnames";
import React, { CSSProperties, MouseEventHandler, ReactNode } from "react";

import Hint from "~/components/hint";
import Txt, { TxtSize } from "~/components/ui/txt";
import { getColors, numbers } from "~/game/actions";
import { ICard, IGameHintsLevel } from "~/game/state";
import { useGame } from "~/hooks/game";

export enum CardSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

const CardClasses = {
  [CardSize.SMALL]: "h1.25 w1.25 h2-l w2-l",
  [CardSize.MEDIUM]: "h2 w2 h4-l w4-l",
  [CardSize.LARGE]: "h3 w3 h4.5-l w4.5-l"
};

const CardTextSizes = {
  [CardSize.SMALL]: TxtSize.SMALL,
  [CardSize.MEDIUM]: TxtSize.MEDIUM,
  [CardSize.LARGE]: TxtSize.MEDIUM
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
  DRAWN,
  OTHER
}

interface CardWrapperProps {
  color: string;
  size?: CardSize;
  playable?: boolean;
  context?: ICardContext;
  className?: string;
  borderWidth?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
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

  const sizeClass = CardClasses[size];

  return (
    <div
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
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
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
  onClick?: MouseEventHandler;
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

  const displayHints =
    game.options.hintsLevel !== IGameHintsLevel.NONE &&
    [
      ICardContext.OTHER_PLAYER,
      ICardContext.TARGETED_PLAYER,
      ICardContext.SELF_PLAYER
    ].includes(context);

  if (selected) {
    style.transform = "scale(1.20)";
  }

  return (
    <CardWrapper
      borderWidth={selected ? "bw1 z-5" : ""}
      className={className}
      color={color}
      context={context}
      playable={playable}
      size={size}
      style={style}
      onClick={onClick}
    >
      {/* Card value */}
      <Txt
        className={classnames(
          "white outline-main-dark",
          { mb3: displayHints && size === "large" },
          { "mb4-l": displayHints && size === "medium" }
        )}
        size={CardTextSizes[size]}
        value={number}
      />

      {/* Card position */}
      {position !== null && size === "large" && (
        <Txt
          className="absolute left-0 top-0 ma1 black-20"
          value={PositionMap[position]}
        />
      )}

      {/* show positive hints with a larger type */}
      {displayHints && hidden && (
        <div
          className={classnames(
            "absolute top-0 mt2 br-100 w-50 h-50 flex justify-center items-center outline-main-dark",
            { [`bg-${card.color}`]: card.hint.color[card.color] === 2 },
            { mt3: size === "large" }
          )}
        >
          {card.hint.number[card.number] === 2 ? card.number : null}
        </div>
      )}

      {/* show other hints, including negative hints */}
      {displayHints && size === "large" && (
        <div className="flex absolute w-100 right-0 bottom-0 pv1 flex-l items-center flex-column bg-black-50">
          <div className="flex justify-around w-100">
            {colors.map(color => (
              <Hint
                key={color}
                hint={card.hint.color[color]}
                type="color"
                value={color}
              />
            ))}
          </div>
          <div
            className="flex justify-around white mt1 mt2-l"
            style={{ width: `${(numbers.length / colors.length) * 100}%` }}
          >
            {numbers.map(number => (
              <Hint
                key={number}
                hint={card.hint.number[number]}
                type="number"
                value={number}
              />
            ))}
          </div>
        </div>
      )}
    </CardWrapper>
  );
}
