import classnames from "classnames";
import React, { MouseEventHandler, ReactNode } from "react";

import Txt, { TxtSize } from "~/components/ui/txt";

export enum ButtonSize {
  TINY,
  SMALL,
  MEDIUM,
  LARGE
}

const ButtonClasses = {
  [ButtonSize.TINY]: "pa1 bw1 pa2-l fw1",
  [ButtonSize.SMALL]: "pv1 ph2 bw1 fw2",
  [ButtonSize.MEDIUM]: "h2.5 pv2 ph3 bw2 fw2",
  [ButtonSize.LARGE]: "pv3 ph4 bw2 fw2"
};

const ButtonTextSizes = {
  [ButtonSize.TINY]: TxtSize.SMALL,
  [ButtonSize.SMALL]: TxtSize.SMALL,
  [ButtonSize.MEDIUM]: TxtSize.MEDIUM,
  [ButtonSize.LARGE]: TxtSize.MEDIUM
};

interface Props {
  size?: ButtonSize;
  onClick?: MouseEventHandler;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  text?: string;
}

export default function Button(props: Props) {
  const {
    size = ButtonSize.MEDIUM,
    onClick,
    className,
    text,
    children,
    disabled
  } = props;

  return (
    <button
      className={classnames(
        className,
        ButtonClasses[size],
        "ba br2 shadow-2 ttu tracked outline-0",
        {
          "bg-white hover-bg-white pointer main-dark b--yellow grow": !disabled
        },
        { "bg-light-gray o-80": disabled }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {text && <Txt size={ButtonTextSizes[size]} value={text} />}
      {!text && children}
    </button>
  );
}
