import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function Box(props: Props) {
  const { className, children } = props;

  return (
    <div
      className={classNames(
        "bg-main-dark pv2 ph2 ph3-l shadow-5 br3 ba b--main-dark",
        className
      )}
    >
      {children}
    </div>
  );
}
