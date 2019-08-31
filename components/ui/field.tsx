import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLLabelElement> {
  label: string;
}

export default function Field(props: Props) {
  const { label, children, ...attributes } = props;

  return (
    <label {...attributes}>
      {label}
      {children}
    </label>
  );
}
