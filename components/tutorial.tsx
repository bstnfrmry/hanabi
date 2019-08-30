import React, { ReactNode, useState, useEffect, useContext } from "react";

import Popover, { PopoverPlace } from "react-popover";

import Button, { IButtonSize } from "~/components/ui/button";
import posed from "react-pose";

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
  STRIKE_TOKENS = 6
}

const steps = {
  [ITutorialStep.WELCOME]: {
    title: "Welcome!",
    body: "Let's learn how to play"
  },
  [ITutorialStep.PLAYED_CARDS]: {
    title: "Played cards",
    body:
      "This is all the cards that have been played.\nReach 5 on each color to win the game."
  },
  [ITutorialStep.DISCARD_PILE]: {
    title: "Discard",
    body:
      "This pile contains all the cards you discarded.\nWatch out and avoid discarding cards you need to finish the game."
  },
  [ITutorialStep.DISCARD_PILE]: {
    title: "Discard",
    body:
      "This pile contains all the cards you discarded.\nWatch out and avoid discarding cards you need to finish the game."
  },
  [ITutorialStep.SELF_PLAYER]: {
    title: "Your game",
    body:
      "These are your cards.\nYou can't see them, but other players can and will give you hints about them.\nTry to remember them."
  },
  [ITutorialStep.OTHER_PLAYERS]: {
    title: "Teammates",
    body:
      "These are your team mates.\nLike you, they can't see their cards.\nGive them hints to help them play or discard them"
  },
  [ITutorialStep.HINT_TOKENS]: {
    title: "Hint tokens",
    body:
      "- Giving a hint costs 1 hint token.\n- Discarding a card grants 1 hint token.\n- Playing a 5 cards grants 1 hint token."
  },
  [ITutorialStep.STRIKE_TOKENS]: {
    title: "Strike tokens",
    body:
      "Playing a wrong card will discard it and cost you 1 strike token.\nReaching 3 strike tokens will instantly lose the game."
  }
};

export const TutorialProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(
    +localStorage.getItem(LocalStorageKey) || ITutorialStep.WELCOME
  );

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
};

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
    if (step === currentStep) {
      setTimeout(() => setPose("attention"), 100);
    }
  });

  if (step !== currentStep) {
    return children ? <>{children}</> : null;
  }

  const { title, body } = steps[step];

  return (
    <>
      <Popover
        isOpen={true}
        className="z-999"
        preferPlace={placement}
        enterExitTransitionDurationMs={0}
        body={
          <div className="flex flex-column b--yellow ba bw1 bg-white pa2 pa3-l br2 main-dark">
            <span className="flex items-center justify-between">
              <span className="f4 f2-l">{title}</span>
              {step > 0 && (
                <span className="gray f7 f4-l mr2">
                  {step} / {totalSteps - 1}
                </span>
              )}
            </span>
            <div className="flex items-center mt2 mt4-l">
              <span className="f7 f3-l pre mr4">{body}</span>

              {step === ITutorialStep.WELCOME && (
                <>
                  <Button
                    onClick={skip}
                    size={IButtonSize.TINY}
                    className="mr1 mr2-l"
                  >
                    Skip
                  </Button>
                  <Button onClick={nextStep} size={IButtonSize.TINY}>
                    Go !
                  </Button>
                </>
              )}

              {step !== ITutorialStep.WELCOME && (
                <>
                  {step > 1 && (
                    <Button
                      onClick={previousStep}
                      size={IButtonSize.TINY}
                      className="mr1 mr2-l"
                    >
                      {"<"}
                    </Button>
                  )}
                  <Button onClick={nextStep} size={IButtonSize.TINY}>
                    {lastStep && <>✓</>}
                    {!lastStep && <>></>}
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <HighlightedArea pose={pose}>{children}</HighlightedArea>
      </Popover>
      <style global jsx>{`
        .Popover-tip {
          fill: rgb(195, 166, 50);
        }
      `}</style>
    </>
  );
}
