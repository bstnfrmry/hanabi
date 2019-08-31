import React, { ReactNode, MouseEventHandler } from "react";
import classnames from "classnames";

export enum IButtonSize {
  TINY,
  SMALL,
  MEDIUM,
  LARGE
}

const ButtonSizes = {
  [IButtonSize.TINY]: "pa1 bw1 pa2-l f6 f4-l",
  [IButtonSize.SMALL]: "pv1 ph2 bw1 f6 f4-l",
  [IButtonSize.MEDIUM]: "h2.5 pv2 ph3 bw2 f6 f4-l",
  [IButtonSize.LARGE]: "pv3 ph4 bw2 f3 f3-l"
};

interface Props {
  size?: IButtonSize;
  onClick?: MouseEventHandler;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

export default function Button(props: Props) {
  const {
    size = IButtonSize.MEDIUM,
    onClick,
    className,
    children,
    disabled
  } = props;

  return (
    <button
      disabled={disabled}
      className={classnames(
        className,
        ButtonSizes[size],
        "ba br2 fw2 shadow-2 ttu tracked outline-0",
        {
          "bg-white hover-bg-white pointer main-dark b--yellow grow": !disabled
        },
        { "bg-light-gray o-80": disabled }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
