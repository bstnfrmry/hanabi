import React from "react";
import Button from "./button";

export default function DrawPile({ cards }) {
  return <Button>Deck ({cards ? cards.length : 0})</Button>;
}
