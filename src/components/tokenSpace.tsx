import classnames from "classnames";
import { range } from "lodash";
import React from "react";

import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";

interface TokenProps {
  color: string;
  amount: number;
}

export function Token(props: TokenProps) {
  const { color, amount } = props;

  if (!amount) {
    return (
      <Txt
        className={classnames(
          "ba flex items-center justify-center br-100 h1.5 w1.5 o-70 gray ba ml2",
          `bg-${color}`,
          `b--${color}`
        )}
        size={TxtSize.SMALL}
        value={0}
      />
    );
  }

  return (
    <div className="relative h1.5 w1.5 ml2">
      {range(amount).map(i => (
        <Txt
          key={i}
          className={classnames(
            "outline-main-dark absolute ba flex items-center justify-center br-100 h1.5 w1.5 ba mr2",
            `bg-${color}`,
            `b--${color}`
          )}
          size={TxtSize.SMALL}
          style={{
            top: `-${i * 3}px`,
          }}
          value={i + 1}
        />
      ))}
    </div>
  );
}

interface Props {
  hints: number;
  strikes: number;
}

export default function TokenSpace(props: Props) {
  const { hints, strikes } = props;

  return (
    <div className="flex nl2">
      <Tutorial placement="below" step={ITutorialStep.HINT_TOKENS}>
        <Token amount={hints} color="hints" />
      </Tutorial>
      <Tutorial placement="below" step={ITutorialStep.STRIKE_TOKENS}>
        <Token amount={strikes} color="strikes" />
      </Tutorial>
    </div>
  );
}
