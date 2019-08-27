import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  className?: string;
  borderColor?: string;
  children: ReactNode;
}

export default function Box(props: Props) {
  const { className, children, borderColor } = props;

  return (
    <div
      className={classNames(
        "pv2 ph2 ph3-l shadow-5 br3",
        { [`ba b--${borderColor}`]: borderColor },
        className
      )}
    >
      {children}
    </div>
  );
}
