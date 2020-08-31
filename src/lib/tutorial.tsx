import React, { ReactNode } from "react";

import Card, { CardSize, ICardContext } from "~/components/card";
import Vignette from "~/components/vignette";
import { useGame } from "~/hooks/game";
import { IAction, IColor, IHintType, INumber } from "~/lib/state";

export type TutorialAction = { action: IAction; content: ReactNode; todo: ReactNode };

function card(color: IColor, number: INumber) {
  return (
    <Card card={{ color, number }} className="inline-flex mh1" context={ICardContext.OTHER} size={CardSize.XSMALL} />
  );
}

function vignette(type: IHintType, value: string | number, options: { small: true } = {}) {
  const { small } = options;

  return (
    <Vignette
      className="inline-flex items-center"
      style={{ width: small ? "12px" : "20px", height: small ? "12px" : "20px", color: "white" }}
      type={type}
      value={value}
    />
  );
}

export function isTutorialAction(tutAction: IAction, action: IAction) {
  if (!tutAction) {
    return true;
  }

  if (tutAction.action !== action.action) {
    return false;
  }

  if (tutAction.action === "hint" && action.action === "hint") {
    return tutAction.to === action.to && tutAction.type === action.type && tutAction.value === action.value;
  }

  if (tutAction.action === "discard" && action.action === "discard") {
    return tutAction.cardIndex === action.cardIndex;
  }

  if (tutAction.action === "play" && action.action === "play") {
    return tutAction.cardIndex === action.cardIndex;
  }
}

export function useTutorialAction() {
  const game = useGame();
  const currentTurn = Math.round(game.turnsHistory.length / game.options.playersCount);

  return tutorialActions[currentTurn];
}

export const tutorialActions: TutorialAction[] = [
  {
    action: { action: "hint", type: "number", value: 1, to: 1, from: 0 },
    content: (
      <>
        At the beginning of the game, you know nothing about your hand, so discarding or playing a card could be
        dangerous. <br />
        It is safer to give a hint. Jane here has two playable cards:
        {card(IColor.YELLOW, 1)}
        and
        {card(IColor.RED, 1)}.<br />
        Let's tell her by hinting her 1s.
      </>
    ),
    todo: <>Click on Jane's game, select {vignette("number", 1)}, then click "Hint"</>,
  },
  {
    action: { action: "play", cardIndex: 1, from: 0 },
    content: (
      <>
        Nice! Jane played her first card from the hint you gave her.
        <br />
        Adam then gave you a {vignette("color", IColor.RED, { small: true })} hint. It might mean your card is
        interesting to play right now! Let's try:
      </>
    ),
    todo: <>Select your game, then play your second card.</>,
  },
  {
    action: { action: "play", cardIndex: 1, from: 0 },
    content: (
      <>
        Nice! Jane played her first card from the hint you gave her.
        <br />
        Adam then gave you a {vignette("color", IColor.RED, { small: true })} hint. It might mean your card is
        interesting to play right now! Let's try:
      </>
    ),
    todo: <>Select your game, then play your second card.</>,
  },
];
