import React, { ReactNode } from "react";
import Card, { CardSize, ICardContext } from "~/components/card";
import Vignette from "~/components/vignette";
import { useGame } from "~/hooks/game";
import IGameState, { IAction, IColor, IHintType, INumber } from "~/lib/state";

export type TutorialAction = { action: IAction; content: ReactNode; todo: ReactNode };

function card(color: IColor, number: INumber) {
  return (
    <Card
      card={{ color, number }}
      className="inline-flex mh1"
      context={ICardContext.OTHER}
      size={CardSize.XSMALL}
      style={{ marginBottom: "-6px" }}
    />
  );
}

function vignette(type: IHintType, value: string | number) {
  return (
    <Vignette
      className="inline-flex items-center"
      style={{ width: "12px", height: "12px", color: "white" }}
      type={type}
      value={value}
    />
  );
}

function token(color: string, size = 1) {
  return <div className={`inline-flex w${size} h${size} bg-${color} ba b--${color} br-100`} />;
}

export function isTutorialAction(game: IGameState, tutAction: IAction, action: IAction) {
  if (!game.options.tutorial) {
    return true;
  }

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
    action: { action: "hint", type: "number", value: 1, to: 2, from: 0 },
    content: (
      <>
        At the beginning of the game, you know nothing about your hand, so discarding or playing a card could be
        dangerous. <br />
        It is safer to give a hint. Adam here has two playable cards:
        {card(IColor.YELLOW, 1)}
        and
        {card(IColor.BLUE, 1)}.<br />
        Let's tell him by hinting him 1s.
      </>
    ),
    todo: <>Tap Adam's game, select {vignette("number", 1)}, then click "Hint"</>,
  },
  {
    action: { action: "play", cardIndex: 1, from: 0 },
    content: (
      <>
        Nice! Adam played his first card from the hint you gave him.
        <br />
        Jane also gave you a {vignette("color", IColor.RED)} hint on 2 cards. It might mean those cards are interesting
        to play right now.
        <br />
        <span className="txt-blue db mt1">Convention: Left-most principle</span>
        When receiving a "play" hint on multiple cards, let's assume it the leftmost one is the interesting one.
      </>
    ),
    todo: <>Select your game, then play your second card.</>,
  },
  {
    action: { action: "play", cardIndex: 2, from: 0 },
    content: (
      <>
        All right. We still know that our third card is red.
        <br />
        <span className="txt-blue db mt1">Convention: optimism</span>
        When receiving a hint on multiple cards, let's assume that they're all playable, one by one, from left to right.
        If it's not the case, let's trust our team to give us a "stop" hint to prevent us from making a mistake.
        <br />
        Let's be optimisic and assume that our third card is {card(IColor.RED, 2)}
      </>
    ),
    todo: <>Select your game, then play your third card.</>,
  },
  {
    action: { action: "hint", type: "color", value: IColor.BLUE, to: 1, from: 0 },
    content: (
      <>
        We don't know anything about our hand and we still have 4 hints {token("hints")} left to give hints.
        <br />
        <br />
        Adam know that his 3rd card is blue. Maybe that if you hint Jane about her {card(IColor.BLUE, 3)} and she plays
        it, Adam will understand he can play his {card(IColor.BLUE, 4)}
      </>
    ),
    todo: <>Tap Jane's game and hint her {vignette("color", IColor.BLUE)}s</>,
  },
  {
    action: { action: "play", cardIndex: 3, from: 0 },
    content: (
      <>
        Hmmm, looks like Adam didn't understand you. No big deal though, no mistakes have been made.
        <br />
        We received a {vignette("color", IColor.YELLOW)} hint. Can you guess what it means?
      </>
    ),
    todo: <>Interpret the hint you just received 😉</>,
  },
  {
    action: { action: "discard", cardIndex: 4, from: 0 },
    content: (
      <>
        Things are progressing nicely, you already played 8 cards. However your team is running low on hints and you'll
        soon get stuck. In order to gain more hints, you'll have to start discarding cards.
        <br />
        <span className="txt-blue db mt1">Convention: right-most discard</span>
        Discarding a card can be risky since you could accidently throw away an important card and get stuck in the
        game. Always discard your unknown right-most card as it's the oldest one. Like so, if it was dangerous to
        discard, your teammates would have had time to let you know.
        <br />
      </>
    ),
    todo: <>Discard your right-most card</>,
  },
  {
    action: { action: "play", cardIndex: 0, from: 0 },
    content: (
      <>
        Looks like your teammates are a bit wasteful. You're out of hints. They'll probably have to discard next turn.
        <br />
      </>
    ),
    todo: <>Play your first card</>,
  },
  {
    action: { action: "hint", type: "number", value: 5, to: 1, from: 0 },
    content: (
      <>
        😅 Adam just discarded {card(IColor.GREEN, 5)}. There's only one {vignette("number", 5)} for each color in the
        deck so it should never be discarded!
        <br />
        <br />
        It might have been predicted using the <span className="txt-blue">right-most discard</span> convention. Adam had
        info about his latest card, so he chose to discard {card(IColor.GREEN, 5)} instead.
        <br />
        <br />
        Always be mindful of what your teammates are likely to do next!
      </>
    ),
    todo: <>Tell Jane about her {card(IColor.YELLOW, 5)}</>,
  },
];
