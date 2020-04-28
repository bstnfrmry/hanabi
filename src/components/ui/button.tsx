import classnames from "classnames";
import React, {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode
} from "react";

import Txt, { TxtSize } from "~/components/ui/txt";

export enum ButtonSize {
  TINY,
  SMALL,
  MEDIUM,
  LARGE
}

const ButtonSizes = {
  [ButtonSize.TINY]: "ph2 br1 pv1 pa2-l fw1 tracked-none",
  [ButtonSize.SMALL]: "pv1 br2 ph2 fw2",
  [ButtonSize.MEDIUM]: "pv2 br2 ph3 fw2",
  [ButtonSize.LARGE]: "pv3 br4 ph4 fw2"
};

const ButtonTxtSizes = {
  [ButtonSize.TINY]: TxtSize.SMALL,
  [ButtonSize.SMALL]: TxtSize.SMALL,
  [ButtonSize.MEDIUM]: TxtSize.MEDIUM,
  [ButtonSize.LARGE]: TxtSize.MEDIUM
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  outlined?: boolean;
  void?: boolean;
  size?: ButtonSize;
  onClick?: MouseEventHandler;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  text?: string;
}

export default function Button(props: Props) {
  const {
    primary = false,
    outlined = false,
    void: void_,
    size = ButtonSize.MEDIUM,
    onClick,
    className,
    text,
    children,
    disabled,
    ...attributes
  } = props;

  return (
    <button
      className={classnames(
        className,
        ButtonSizes[size],
        "shadow-2 ttu tracked outline-0 lh-normal",
        { bn: !outlined },
        { "pointer grow": !disabled },
        { "o-80": disabled },
        { "bg-cta shadow-light": primary },
        { "bg-transparent ba b--white near-white": outlined },
        { "main-dark": !disabled && !void_ && !outlined },
        { "bg-transparent near-white": void_ }
      )}
      disabled={disabled}
      onClick={onClick}
      {...attributes}
    >
      {text && <Txt size={ButtonTxtSizes[size]} value={text} />}
      {!text && children}
    </button>
  );
}
