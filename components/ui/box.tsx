import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  className?: string;
  borderColor?: string;
  children: ReactNode;
}

export default function Box(props: Props) {
  const { className, children, borderColor = "main-dark" } = props;

  return (
    <div
      className={classNames(
        "bg-main-dark pv2 ph2 ph3-l shadow-5 br3 ba",
        `b--${borderColor}`,
        className
      )}
    >
      {children}
    </div>
  );
}
