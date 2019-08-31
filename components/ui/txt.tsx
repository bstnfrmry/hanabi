import classnames from "classnames";
import React, { HTMLAttributes } from "react";

export enum TxtSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

const SizeMap = {
  [TxtSize.SMALL]: "",
  [TxtSize.MEDIUM]: "f4",
  [TxtSize.LARGE]: "ttu f2 tracked outline-main-dark"
};

interface Props extends HTMLAttributes<HTMLSpanElement> {
  size?: TxtSize;
  content?: string;
}

export default function Txt(props: Props) {
  const { size = TxtSize.SMALL, content, children, ...attributes } = props;

  return (
    <span className={classnames(SizeMap[size], classnames)} {...attributes}>
      {content || children}
    </span>
  );
}
