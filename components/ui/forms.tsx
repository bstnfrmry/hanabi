import classnames from "classnames";
import React, {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes
} from "react";

import Txt, { TxtSize } from "~/components/ui/txt";

interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: ReactNode;
}

export function Field(props: FieldProps) {
  const { label, className, children, ...attributes } = props;

  return (
    <label
      {...attributes}
      className={classnames(
        "flex justify-between items-center ph1 h2",
        className
      )}
    >
      <Txt size={TxtSize.MEDIUM} value={label} />
      {children}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput(props: InputProps) {
  const { className, ...attributes } = props;

  return (
    <input
      className={classnames("h2 pa2 ba br2 b--yellow", className)}
      type="text"
      {...attributes}
    />
  );
}

export function Checkbox(props: InputProps) {
  const { className, ...attributes } = props;

  return (
    <input
      className={classnames("w1 h1", className)}
      type="checkbox"
      {...attributes}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { [value: string]: ReactNode };
}

export function Select(props: SelectProps) {
  const { options, className, ...attributes } = props;

  return (
    <select
      className={classnames("h2 br2 ba b--yellow", className)}
      {...attributes}
    >
      {Object.keys(options).map(value => (
        <option key={value} value={value}>
          {options[value]}
        </option>
      ))}
    </select>
  );
}
