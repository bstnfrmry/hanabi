import React from "react";

export default function DrawPile({ cards }) {
  return (
    <button className="pa3 br1 ba f6 f4-l fw2 tracked ttu ml1 gray pointer">
      Deck ({cards ? cards.length : 0})
    </button>
  );
}
