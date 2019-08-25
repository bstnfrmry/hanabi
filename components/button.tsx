import React, { ReactNode } from "react";
import classnames from "classnames";

interface IButton {
  onClick?: any;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

export default function Button(props: IButton) {
  const { onClick, className, children, disabled } = props;

  return (
    <div>
      <button
        disabled={disabled}
        className={classnames(
          className,
          "pa2 ba br2 fw2 f6 f4-l lh-copy tracked ttu ml1 dark-gray bg-near-white hover-bg-white grow outline-0",
          { pointer: !disabled, "bg-light-gray gray": disabled }
        )}
        onClick={onClick}
      >
        {children}
      </button>
      <style></style>
    </div>
  );
}
