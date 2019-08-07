import React from "react";

function Token({ color, amount }) {
  return <>
    <div
      className={[
        "flex items-center justify-center mr2 br-100 h3 w3 fw2 f3 white",
        `bg-${color}`,
        `b--${color}`
      ].join(' ')}
    >
      {amount}
    </div>
  </>
}

export default ({ noteTokens, stormTokens }) => (
  <div className="flex">
    <Token color="hints" amount={noteTokens} />
    <Token color="strikes" amount={stormTokens} />
  </div>
);
