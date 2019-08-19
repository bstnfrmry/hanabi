import React from "react";

function Token({ color, amount }) {
  return (
    <>
      <div
        className={[
          "flex items-center justify-center mr2 br-100 h2 w2 h3-l w3-l fw2 f5 f3-l white",
          `bg-${color}`,
          `b--${color}`
        ].join(" ")}
      >
        {amount}
      </div>
    </>
  );
}

export default function TokenSpace({ noteTokens, stormTokens }) {
  return (
    <div className="flex">
      <Token color="hints" amount={noteTokens} />
      <Token color="strikes" amount={stormTokens} />
    </div>
  );
}
