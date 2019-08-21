import React from "react";
import { CardWrapper } from "./card";

export default function DrawPile({ cards }) {
  return (
    <CardWrapper color="light-silver">{cards ? cards.length : 0}</CardWrapper>
  );
}
