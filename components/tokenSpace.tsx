import classnames from "classnames";
import { range } from "lodash";
import React from "react";

import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";

interface TokenProps {
  color: string;
  amount: number;
}

function Token(props: TokenProps) {
  const { color, amount } = props;

  if (!amount) {
    return (
      <Txt
        className={classnames(
          "ba flex items-center justify-center br-100 h2 w2 h3-l w3-l o-70 gray ba mr2",
          `bg-${color}`,
          `b--${color}`
        )}
        size={TxtSize.MEDIUM}
        value={0}
      />
    );
  }

  return (
    <div className="relative h2 w2 h3-l w3-l mr2">
      {range(amount).map(i => (
        <Txt
          key={i}
          className={classnames(
            "outline-main-dark absolute ba flex items-center justify-center br-100 h2 w2 h3-l w3-l ba mr2",
            `bg-${color}`,
            `b--${color}`
          )}
          size={TxtSize.MEDIUM}
          style={{
            top: `-${i * 3}px`
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
    <div className="flex">
      <Tutorial placement="below" step={ITutorialStep.HINT_TOKENS}>
        <Token amount={hints} color="hints" />
      </Tutorial>
      <Tutorial placement="below" step={ITutorialStep.STRIKE_TOKENS}>
        <Token amount={strikes} color="strikes" />
      </Tutorial>
    </div>
  );
}
