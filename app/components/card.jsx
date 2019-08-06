import React from "react";

// Cards possible sizes
const SizeMap = {
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

export default ({ card, context, color, hidden, size = 'medium', className = '' }) => {
  const sizeClass = SizeMap[size]

  let cardColor = color
  let cardValue = null
  if (card) {
    cardColor = hidden
      ? card.knowledge.color && card.color 
      : card.color
    cardValue = hidden 
      ? card.knowledge.value && card.value 
      : card.value
  }

  return (
    <div
      className={[
        "relative flex items-center justify-center br1 ba",
        sizeClass,
        className,
        `bg-hanabi-${cardColor}`
      ].join(' ')}
    >
      {cardValue}
      {context === CardContext.OTHER_PLAYER && <>
        {card.knowledge.value && 
          <div className="absolute right-0 top-0">V</div>
        }
        {card.knowledge.color && 
          <div className="absolute right-0 bottom-0">C</div>
        }
      </>}
    </div>
  );
};
