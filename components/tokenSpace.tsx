import classnames from "classnames";
import { range } from "lodash";
import React from "react";
import posed, { PoseGroup } from "react-pose";

import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Txt from "~/components/ui/txt";

const TokenAnimationWrapper = posed.div({
  enter: { opacity: 1, y: 0, transition: { duration: 1000 } },
  exit: { opacity: 0, y: 10000, transition: { duration: 1000 } }
});

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
        value={0}
      />
    );
  }

  return (
    <div className="relative h2 w2 h3-l w3-l mr2">
      <PoseGroup>
        {range(amount).map(i => (
          <TokenAnimationWrapper key={i}>
            <Txt
              className={classnames(
                "outline-main-dark absolute ba flex items-center justify-center br-100 h2 w2 h3-l w3-l ba mr2",
                `bg-${color}`,
                `b--${color}`
              )}
              style={{
                top: `-${i * 3}px`
              }}
              value={i + 1}
            />
          </TokenAnimationWrapper>
        ))}
      </PoseGroup>
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
    <div className="flex flex-column-l">
      <Tutorial placement="left" step={ITutorialStep.HINT_TOKENS}>
        <Token amount={hints} color="hints" />
      </Tutorial>
      <Tutorial placement="left" step={ITutorialStep.STRIKE_TOKENS}>
        <Token amount={strikes} color="strikes" />
      </Tutorial>
    </div>
  );
}
