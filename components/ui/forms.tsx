import React, {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
  LabelHTMLAttributes
} from "react";
import classnames from "classnames";

interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
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
      {label}
      {children}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput(props: InputProps) {
  const { className, ...attributes } = props;

  return (
    <input
      type="text"
      className={classnames("h2 pa2 bg-white ba br2 b--yellow", className)}
      {...attributes}
    />
  );
}

export function Checkbox(props: InputProps) {
  const { className, ...attributes } = props;

  return (
    <input
      type="checkbox"
      className={classnames("w1 h1", className)}
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
      className={classnames("h2 bg-white br2 ba b--yellow", className)}
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
