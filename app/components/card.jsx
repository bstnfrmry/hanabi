import React from "react";

// Cards possible sizes
export const SizeMap = {
  tiny: "", // TODO h0 doesnt exist
  small: "h1 w1",
  medium: "h2 w2",
  large: "h3 w3",
  extralarge: "h4 w3"
}

export const CardContext = {
  SELF_PLAYER: 'selfPlayer',
  OTHER_PLAYER: 'otherPlayer',
  PLAYED: 'played'
}

export function CardWrapper(props) {
  const {
    color,
    size = 'medium',
    className = '',
    style = {},
    children
  } = props
  
  const sizeClass = SizeMap[size]

  return <div
    style={style}
    className={[
      "relative flex items-center justify-center br1 ba",
      sizeClass,
      className,
      `bg-hanabi-${color}`
    ].join(' ')}
  >
    {children}
  </div>
};

export default function Card(props) {
  const {
    card,
    context,
    hidden = false,
    size = 'medium',
    className = '',
    style = {}
  } = props

  const color = hidden
    ? card.knowledge.color && card.color 
    : card.color
  const value = hidden 
    ? card.knowledge.value && card.value 
    : card.value

  return (
    <CardWrapper
      style={style}
      color={color}
      size={size}
      className={className}
      style={style}
    >
      {value}
      {context === CardContext.OTHER_PLAYER && <>
        {card.knowledge.value && 
          <div className="absolute right-0 top-0">V</div>
        }
        {card.knowledge.color && 
          <div className="absolute right-0 bottom-0">C</div>
        }
      </>}
    </CardWrapper>
  );
};
