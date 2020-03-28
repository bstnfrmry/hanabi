import classnames from "classnames";
import React, { HTMLAttributes, ReactNode } from "react";

export enum TxtSize {
  TINY = "tiny",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

const TxtSizes = {
  [TxtSize.TINY]: "f7 f6-l",
  [TxtSize.SMALL]: "f6 f5-l",
  [TxtSize.MEDIUM]: "f5 f4-l",
  [TxtSize.LARGE]: "ttu f2 f1-l tracked"
};

interface Props extends HTMLAttributes<HTMLSpanElement> {
  italic?: boolean;
  uppercase?: boolean;
  multiline?: boolean;
  size?: TxtSize;
  value?: ReactNode;
}

export default function Txt(props: Props) {
  const {
    size = TxtSize.SMALL,
    italic = false,
    uppercase = false,
    multiline = false,
    value: content,
    children,
    className,
    ...attributes
  } = props;

  return (
    <span
      className={classnames(
        TxtSizes[size],
        { ttu: uppercase },
        { i: italic },
        { "pre-line": multiline },
        className
      )}
      {...attributes}
    >
      {content !== undefined ? content : children}
    </span>
  );
}
