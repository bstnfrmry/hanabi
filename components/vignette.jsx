import React from "react";

export default function Vignette(props) {
  const { type, value, onClick, selected } = props;

  return (
    <div
      className={[
        "ba pointer flex items-center justify-center mr2 br-100 h2 w2 grow fw2",
        type === "color"
          ? `bg-${value} b--${value}`
          : "bg-gray-light b-gray-light",
        selected ? "bw2" : ""
      ].join(" ")}
      onClick={e => onClick({ type, value })}
    >
      {type === "number" && value}
    </div>
  );
}
