import React from "react";

export default function Vignette(props) {
  const { type, value } = props

  return <div
    className={[
      "ba pointer flex items-center justify-center mr2 br-100 h2 w2 grow fw2",
      ...type === 'color' ? [
        `bg-${value}`,
        `b--${value}`,
      ] : [
        'bg-gray-light',
        'b-gray-light',
      ]
    ].join(' ')}
  >
    {type === 'number' && value}
  </div>
};
