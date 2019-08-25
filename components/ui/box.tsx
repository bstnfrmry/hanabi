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
      className={classNames("bg-main-dark pa2 pa3-l shadow-5 br2", className)}
    >
      {children}
    </div>
  );
}
