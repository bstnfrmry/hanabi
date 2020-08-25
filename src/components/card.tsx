import classnames from "classnames";
import React, { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode, useState } from "react";
import Popover from "react-popover";

import ColorSymbol from "~/components/colorSymbol";
import Hint from "~/components/hint";
import Turn from "~/components/turn";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import useLongPress from "~/hooks/longPress";
import { getColors, numbers } from "~/lib/actions";
import { ICard, IColor, IGameHintsLevel, IHintLevel } from "~/lib/state";

export enum CardSize {
  XSMALL = "xsmall",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  FLEX = "flex",
}

const CardClasses = {
  [CardSize.XSMALL]: "h1.25 w1.25 h2-l w2-l",
  [CardSize.SMALL]: "h1.5 w1.5",
  [CardSize.MEDIUM]: "h2 w2 h2.5-l w2.5-l",
  [CardSize.LARGE]: "h3 w3 h3.5-l w3.5-l",
  [CardSize.FLEX]: "flex-square",
};

const CardTextSizes = {
  [CardSize.XSMALL]: TxtSize.XSMALL,
  [CardSize.SMALL]: TxtSize.SMALL,
  [CardSize.MEDIUM]: TxtSize.MEDIUM,
  [CardSize.LARGE]: TxtSize.MEDIUM,
};

const SymbolOffset = {
  [CardSize.XSMALL]: 1,
  [CardSize.SMALL]: 0,
  [CardSize.MEDIUM]: 3,
  [CardSize.LARGE]: -4,
};

const SymbolSize = {
  [CardSize.XSMALL]: "f3",
  [CardSize.SMALL]: "f1",
  [CardSize.MEDIUM]: "f1-l f2",
  [CardSize.LARGE]: "f0-l f1",
};

export const PositionMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
};

export enum ICardContext {
  SELF_PLAYER,
  OTHER_PLAYER,
  TARGETED_PLAYER,
  PLAYED,
  DISCARDED,
  DRAWN,
  OTHER,
}

interface CardWrapperProps extends HTMLAttributes<HTMLElement> {
  color: string;
  size?: CardSize;
  playable?: boolean;
  context?: ICardContext;
  className?: string;
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
    style = {},
    onClick,
    children,
    ...attributes
  } = props;

  const game = useGame();

  const sizeClass = CardClasses[size];

  return (
    <div
      className={classnames(
        "relative flex items-center justify-center br1 ba",
        sizeClass,
        className,
        `bg-${color}`,
        { "shadow-2": size.includes("large") },
        { "shadow-1": size.includes("medium") },
        { pointer: playable },
        { grow: context === ICardContext.TARGETED_PLAYER }
      )}
      style={style}
      onClick={onClick}
      {...attributes}
    >
      {game.options.colorBlindMode && <ColorSymbol color={color as IColor} />}
      {children}
    </div>
  );
}

interface CardPartialHintProps {
  card: ICard;
  size: CardSize;
}

/**
 * Players can't view their own cards.
 * However, we'll show them sure values/colors from their received hints when applicable.
 * - Sure numbers will be displayed
 * - Sure colors will be displayed
 * - Sure (including rainbow) colors will display a rainbow background and a colored border
 */
function CardPartialHint(props: CardPartialHintProps) {
  const { card, size } = props;

  const game = useGame();

  const displayColorSymbol = game.options.colorBlindMode && card.hint.color[card.color] === IHintLevel.SURE;
  let className = "";

  // when card is sure, apply a colored background and border using the card color
  if (card.hint.color[card.color] === IHintLevel.SURE) {
    const color = card.color === IColor.RAINBOW ? `rainbow-circle` : card.color;

    className = classnames(`txt-${card.color}-dark`, {
      [`bg-${color} ba b--${card.color}`]: !displayColorSymbol,
    });
  }

  // when they are only 2 possible cards and one of them is rainbow,
  // apply a rainbow background and a thick border using the other possible color
  const possibleColors = Object.keys(card.hint.color).filter(color => card.hint.color[color] === IHintLevel.POSSIBLE);
  if (card.hint.color.rainbow === IHintLevel.POSSIBLE && possibleColors.length === 2) {
    const possibleColor = possibleColors.find(color => color !== IColor.RAINBOW);

    className = classnames(`bg-rainbow-circle ba b--${possibleColor}-clear`, {
      "bw1.5": size !== CardSize.LARGE,
      "bw2": size === CardSize.LARGE,
    });
  }

  return (
    <>
      <div
        className={classnames("top-0 br-100 w-50 h-50 flex justify-center items-center", className, {
          [`txt-white-dark`]: card.hint.color[card.color] !== IHintLevel.SURE,
        })}
      >
        {card.hint.number[card.number] === IHintLevel.SURE && <Txt className="z-1" value={card.number} />}
      </div>
      {displayColorSymbol && <ColorSymbol color={card.color} />}
    </>
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
    onClick,
    hidden = false,
    playable = true,
    size = CardSize.MEDIUM,
    className = "",
    style = {},
    position = null,
    selected = false,
  } = props;

  const game = useGame();
  const [isHintPopoverOpen, setIsHintPopoverOpen] = useState(false);
  const longPressProps = useLongPress(() => {
    setIsHintPopoverOpen(true);
  });

  const colors = getColors(game);
  const color = hidden ? "gray-light" : card.color;

  const number = hidden ? null : card.number;

  const displayColorSymbol = game.options.colorBlindMode;
  const displayHints =
    game.options.hintsLevel !== IGameHintsLevel.NONE &&
    [ICardContext.OTHER_PLAYER, ICardContext.TARGETED_PLAYER, ICardContext.SELF_PLAYER].includes(context);

  if (selected) {
    try {
      style.transform = "scale(1.20)";
    } catch (e) {
      // This operation sometimes crashes because of a conflict with react-popover
      // This try/catch aims to prevent it and inhibate the error.
    }
  }

  return (
    <CardWrapper
      className={classnames({ "bw1 z-5": selected }, className)}
      color={color}
      context={context}
      data-card={PositionMap[position]}
      playable={playable}
      size={size}
      style={{
        ...style,
        userSelect: "none",
      }}
      onClick={onClick}
      {...longPressProps}
    >
      {/* Card value */}
      <Txt
        className={classnames(`b absolute`, {
          "bottom-1 mb3": displayHints && size === CardSize.LARGE,
          [`txt-${color}-dark`]: !displayColorSymbol,
          "main-dark": displayColorSymbol,
        })}
        size={CardTextSizes[size]}
        value={number}
      />

      {/* Card position */}
      {position !== null && size === CardSize.LARGE && (
        <Txt className="absolute left-0 top-0 ma1 black-40" value={PositionMap[position]} />
      )}

      {/* Whether the card has received hints */}
      {position !== null && card.receivedHints?.length > 0 && (
        <Popover
          body={
            <div className="flex items-center justify-center b--yellow ba bw1 bg-black pa2 pr3 br2">
              <div className="flex flex-column">
                {card?.receivedHints?.map((turn, i) => {
                  return (
                    <div key={i} className="nb1">
                      <Turn showDrawn={false} showPosition={false} turn={turn} />
                    </div>
                  );
                })}
              </div>
            </div>
          }
          className="z-999"
          isOpen={isHintPopoverOpen}
          onOuterAction={() => setIsHintPopoverOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bg-hints br--bottom br--left br-100"
            style={{ width: "20%", height: "20%" }}
            onMouseEnter={() => setIsHintPopoverOpen(true)}
            onMouseLeave={() => setIsHintPopoverOpen(false)}
          />
        </Popover>
      )}

      {/* show positive hints with a larger type */}
      {displayHints && hidden && <CardPartialHint card={card} size={size} />}

      {/* show other hints, including negative hints */}
      {displayHints && size === CardSize.LARGE && (
        <div className="flex absolute w-100 right-0 bottom-0 pv1 flex-l items-center flex-column bg-black-50">
          <div className="flex justify-around w-100">
            {colors.map(color => (
              <Hint key={color} hint={card.hint.color[color]} type="color" value={color} />
            ))}
          </div>
          <div
            className="flex justify-around white mt1 mt2-l"
            style={{ width: `${(numbers.length / colors.length) * 100}%` }}
          >
            {numbers.map(number => (
              <Hint key={number} hint={card.hint.number[number]} type="number" value={number} />
            ))}
          </div>
        </div>
      )}
    </CardWrapper>
  );
}
