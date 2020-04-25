import React, { ReactNode, useContext, useEffect, useState } from "react";
import Popover, { PopoverPlace } from "react-popover";
import posed from "react-pose";

import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";

export const TutorialContext = React.createContext(null);

const LocalStorageKey = "tutorialStep";

const HighlightedArea = posed.div({
  attention: {
    opacity: 0.7,
    transition: {
      type: "spring",
      stiffness: 10,
      damping: 0
    }
  }
});

export enum ITutorialStep {
  WELCOME = 0,
  PLAYED_CARDS = 1,
  DISCARD_PILE = 2,
  SELF_PLAYER = 3,
  OTHER_PLAYERS = 4,
  HINT_TOKENS = 5,
  STRIKE_TOKENS = 6,
  YOUR_TURN = 7
}

const steps = {
  [ITutorialStep.WELCOME]: {
    title: "Tutorial",
    body: "Let's learn how to play!"
  },
  [ITutorialStep.PLAYED_CARDS]: {
    title: "Played cards",
    body:
      "This will nest the cards that have been played.\nCollectively, reach 5 on each color to win the game."
  },
  [ITutorialStep.DISCARD_PILE]: {
    title: "Discard",
    body:
      "Here you will see the cards\nyou and your team discarded.\nAvoid discarding the ones\nyou need to finish the game."
  },
  [ITutorialStep.SELF_PLAYER]: {
    title: "Your game",
    body:
      "These are your cards.\nYou can't see them, but other players can and will give you hints about them."
  },
  [ITutorialStep.OTHER_PLAYERS]: {
    title: "Teammates",
    body:
      "These are your teammates.\nLike you, they can't see their cards.\nGive them hints to help them play or discard cards"
  },
  [ITutorialStep.HINT_TOKENS]: {
    title: "Hint tokens",
    body:
      "Some actions have a cost.\n\n- Giving a hint costs 1 hint token.\n- Discarding a card grants 1 hint token.\n- Playing a 5 gives 1 hint token as a bonus"
  },
  [ITutorialStep.STRIKE_TOKENS]: {
    title: "Strike tokens",
    body:
      "Playing a wrong card will discard it and cost you 1 strike token.\nReaching 3 strike tokens will instantly lose the game."
  },
  [ITutorialStep.YOUR_TURN]: {
    title: "It's your turn",
    body:
      "You have 3 options:\n\n- Tap your game to play a card...\n- ... or discard it\n- Tap one of your teammates games to give them a hint"
  }
};

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider(props: TutorialProviderProps) {
  const { children } = props;

  const [currentStep, setCurrentStep] = useState(ITutorialStep.WELCOME);

  useEffect(() => {
    setCurrentStep(+localStorage.getItem(LocalStorageKey));
  }, []);

  function setStep(step: number) {
    setCurrentStep(step);
    localStorage.setItem(LocalStorageKey, step.toString());
  }

  const count = Object.keys(steps).length;

  return (
    <TutorialContext.Provider
      value={{
        currentStep,
        totalSteps: count,
        lastStep: currentStep === count - 1,
        previousStep: () => setStep(currentStep - 1),
        nextStep: () => setStep(currentStep + 1),
        skip: () => setStep(-1),
        reset: () => setStep(1)
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

interface Props {
  step: ITutorialStep;
  placement?: PopoverPlace;
  children?: ReactNode;
}

export default function Tutorial(props: Props) {
  const { step, placement, children } = props;

  const [pose, setPose] = useState(null);
  const {
    currentStep,
    previousStep,
    nextStep,
    lastStep,
    skip,
    totalSteps
  } = useContext(TutorialContext);

  useEffect(() => {
    if (step !== currentStep) return;

    const interval = setTimeout(() => setPose("attention"), 100);

    return () => clearInterval(interval);
  }, [currentStep]);

  if (step !== currentStep) {
    return children ? <>{children}</> : null;
  }

  const { title, body } = steps[step];

  return (
    <Popover
      body={
        <div className="flex flex-column b--yellow ba bw1 bg-white pa2 pa3-l br2 main-dark">
          <span className="flex items-center justify-between">
            <Txt size={TxtSize.MEDIUM} value={title} />
            {step > 0 && (
              <Txt className="gray mr2" value={`${step} / ${totalSteps - 1}`} />
            )}
          </span>
          <div className="flex flex-column mt1 mt2-l">
            <Txt multiline className="mr4" value={body} />

            {step === ITutorialStep.WELCOME && (
              <div className="flex self-end mt1 ph1">
                <Button
                  className="mr1 mr2-l"
                  id="skip-tutorial"
                  size={ButtonSize.TINY}
                  text="✕ Skip"
                  onClick={skip}
                />
                <Button size={ButtonSize.TINY} text="Go !" onClick={nextStep} />
              </div>
            )}

            {step !== ITutorialStep.WELCOME && (
              <>
                {step > 1 && (
                  <Button
                    className="mr1 mr2-l"
                    size={ButtonSize.TINY}
                    text="<"
                    onClick={previousStep}
                  />
                )}
                <Button
                  size={ButtonSize.TINY}
                  text={lastStep ? "✓" : ">"}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextStep();
                  }}
                />
              </>
            )}
          </div>
        </div>
      }
      className="z-999"
      enterExitTransitionDurationMs={0}
      isOpen={true}
      preferPlace={placement}
    >
      <HighlightedArea pose={pose}>{children}</HighlightedArea>
    </Popover>
  );
}
