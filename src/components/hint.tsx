import classnames from "classnames";
import React from "react";

import Txt from "~/components/ui/txt";
import { IColor, IHintLevel, IHintType, INumber } from "~/game/state";

interface Props {
  type: IHintType;
  value: IColor | INumber;
  hint: IHintLevel;
  className?: string;
}

export default function Hint(props: Props) {
  const { type, value, hint, className } = props;

  const color = type === "color" ? value : "white";

  return (
    <>
      <div
        className={classnames(
          className,
          "flex justify-center items-center hint"
        )}
      >
        {hint !== 0 && (
          <div
            className={classnames(
              "outline-main-dark pointer flex items-center justify-center br-100 h-100 w-100 white",
              { [`bg-${color}`]: type === "color" },
              { [`ba bw0.5 b--${color}`]: type === "color" && hint === 2 },
              { [`b`]: type === "number" && hint === 2 }
            )}
          >
            {type === "number" && <Txt value={value} />}
          </div>
        )}
        {hint === 0 && (
          <div className="w-100 h-100 relative flex justify-center items-center">
            {type === "number" && (
              <Txt className="absolute white o-50" value={value} />
            )}
            <div
              className={`absolute w-100 o-80 rotate-135 bg-${color} b--${color}`}
              style={{ height: "2px" }}
            />
          </div>
        )}
      </div>
      <style jsx>{`
        .hint {
          width: 0.5rem;
          height: 0.5rem;
        }
      `}</style>
    </>
  );
}
