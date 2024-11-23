import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, ArrowContainer, PopoverPosition } from "react-tiny-popover";
import posed from "react-pose";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { POPOVER_ARROW_COLOR, POPOVER_CONTENT_STYLE } from "~/components/popoverAppearance";

export const TutorialContext = React.createContext(null);

const LocalStorageKey = "tutorialStep";

const HighlightedArea = posed.div({
  attention: {
    opacity: 0.7,
    transition: {
      type: "spring",
      stiffness: 10,
      damping: 0,
    },
  },
});

export enum ITutorialStep {
  WELCOME = 0,
  PLAYED_CARDS = 1,
  DISCARD_PILE = 2,
  SELF_PLAYER = 3,
  OTHER_PLAYERS = 4,
  HINT_TOKENS = 5,
  STRIKE_TOKENS = 6,
  YOUR_TURN = 7,
}

const steps = {
  [ITutorialStep.WELCOME]: {
    title: "introTutorial",
    body: "introContent",
  },
  [ITutorialStep.PLAYED_CARDS]: {
    title: "playedCardsTutorial",
    body: "playedCardsTutorialContent",
  },
  [ITutorialStep.DISCARD_PILE]: {
    title: "discardTutorial",
    body: "discardTutorialContent",
  },
  [ITutorialStep.SELF_PLAYER]: {
    title: "yourGameTutorial",
    body: "yourGameTutorialContent",
  },
  [ITutorialStep.OTHER_PLAYERS]: {
    title: "teammatesTutorial",
    body: "teammatesTutorialContent",
  },
  [ITutorialStep.HINT_TOKENS]: {
    title: "hintTokensTutorial",
    body: "hintTokensTutorialContent",
  },
  [ITutorialStep.STRIKE_TOKENS]: {
    title: "strikeTokensTutorial",
    body: "strikeTokensTutorialContent",
  },
  [ITutorialStep.YOUR_TURN]: {
    title: "yourTurnTutorial",
    body: "yourTurnTutorialContent",
  },
};

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider(props: TutorialProviderProps) {
  const { children } = props;

  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    const storedStep = localStorage.getItem(LocalStorageKey);

    if (storedStep) {
      setCurrentStep(+localStorage.getItem(LocalStorageKey));
    }
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
        reset: () => setStep(1),
        hardReset: () => setStep(0),
        isOver: currentStep === count || currentStep === -1,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

interface Props {
  step: ITutorialStep;
  placement?: PopoverPosition;
  children?: ReactNode;
}

export default function Tutorial(props: Props) {
  const { step, placement, children } = props;
  const { t } = useTranslation();

  const [pose, setPose] = useState(null);
  const context = useContext(TutorialContext);

  const { currentStep, previousStep, nextStep, lastStep, skip, totalSteps } = context || {};

  useEffect(() => {
    if (step !== currentStep) return;

    const interval = setTimeout(() => setPose("attention"), 100);

    return () => clearInterval(interval);
  }, [currentStep, step]);

  if (!context || step !== currentStep) {
    return children ? <>{children}</> : null;
  }

  const { title, body } = steps[step];

  return (
    <Popover
      containerClassName="z-999"
      content={({ position, childRect, popoverRect }) => {
        return (
          <ArrowContainer
            arrowColor={POPOVER_ARROW_COLOR}
            arrowSize={10}
            arrowStyle={{ opacity: 1 }}
            childRect={childRect}
            popoverRect={popoverRect}
            position={position}
          >
            <div className="flex flex-column ba bw1 bg-white pa2 pa3-l br2 main-dark" style={POPOVER_CONTENT_STYLE}>
              <span className="flex items-center justify-between">
                <Txt className="ttu" size={TxtSize.MEDIUM} value={t(title)} />
                {step > 0 && <Txt className="gray mr2" value={`${step} / ${totalSteps - 1}`} />}
              </span>
              <div className="flex flex-column mt1 mt2-l">
                <Txt multiline className="mr4" value={t(body)} />

                {step === ITutorialStep.WELCOME && (
                  <div className="flex self-end mt1 ph1">
                    <Button
                      className="mr1 mr2-l"
                      id="skip-tutorial"
                      size={ButtonSize.TINY}
                      text={t("skip")}
                      onClick={skip}
                    />
                    <Button size={ButtonSize.TINY} text={t("go")} onClick={nextStep} />
                  </div>
                )}

                {step !== ITutorialStep.WELCOME && (
                  <div className="flex self-end mt1 ph1">
                    {step > 1 && (
                      <Button className="mr1 mr2-l" size={ButtonSize.TINY} text="<" onClick={previousStep} />
                    )}
                    <Button
                      size={ButtonSize.TINY}
                      text={lastStep ? "✓" : ">"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextStep();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </ArrowContainer>
        );
      }}
      isOpen={true}
      positions={placement}
    >
      <HighlightedArea pose={pose}>{children}</HighlightedArea>
    </Popover>
  );
}
