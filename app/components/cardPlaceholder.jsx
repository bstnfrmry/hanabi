import React from "react";

import { SizeMap } from "./card"

/**
 * Component displayed on colored card piles when the pile is empty.
 * Should use the same styling as <Card />
 */
export default function CardPlaceholder({ color, size = 'medium', className = '' }) {
  const sizeClass = SizeMap[size]

  return <div
    className={[
      "relative flex items-center justify-center br1 ba",
      sizeClass,
      className,
      `bg-hanabi-${color}`
    ].join(' ')}
  />
};
