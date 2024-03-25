import React from "react";

export function CornerMark(props: { onActivationChange: (b: boolean) => void }) {
  return (
    <div
      className="absolute right-0 top-0 bg-hints br--bottom br--left br-100"
      style={{ width: "20%", height: "20%" }}
      onMouseEnter={() => props.onActivationChange(true)}
      onMouseLeave={() => props.onActivationChange(false)}
    />
  );
}
