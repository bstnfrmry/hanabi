import { useRouter } from "next/router";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import posed, { PoseGroup } from "react-pose";

import Card, { CardSize, ICardContext } from "~/components/card";
import HomeButton from "~/components/homeButton";
import PlayedCards from "~/components/playedCards";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { Paragraph, Subtitle, Title } from "~/components/ui/typography";
import Vignette from "~/components/vignette";
import useLocalStorage from "~/hooks/localStorage";
import { getColors, newGame, numbers } from "~/lib/actions";
import { logEvent } from "~/lib/analytics";
import { updateGame } from "~/lib/firebase";
import { readableUniqueId } from "~/lib/id";
import { GameMode, GameVariant, IColor, IGameHintsLevel, IHintType, INumber } from "~/lib/state";

function card(color: IColor, number: INumber, size = CardSize.XSMALL, position?: number) {
  return (
    <Card
      card={{ color, number }}
      className="inline-flex ml1"
      context={ICardContext.OTHER}
      position={position}
      size={size}
    />
  );
}

function vignette(type: IHintType, value: string | number) {
  return (
    <Vignette
      className="inline-flex items-center"
      style={{ width: "22px", height: "22px", color: "white", marginRight: 0 }}
      type={type}
      value={value}
    />
  );
}

function token(color: string, size = 1) {
  return <div className={`inline-flex w${size} h${size} bg-${color} ba b--${color} br-100`} />;
}

const Divider = () => <div className="mv4 bt b--yellow w4" />;

const useSteps = () => {
  const { t } = useTranslation();
  const [colorBlindMode, setColorBlindMode] = useLocalStorage("colorBlindMode", false);
  const amountPerNumber = {
    1: 3,
    2: 2,
    3: 2,
    4: 2,
    5: 1,
  };

  return [
    {
      html: (
        <>
          <Title className="ttu mb4">{t("learn.welome.title", "Learn Hanabi")}</Title>
          <Paragraph>
            {t("learn.welcome.1", "Welcome! In this brief tutorial, you'll play a game by yourself.")}
          </Paragraph>
          <Paragraph>{t("learn.welcome.2", "Don't worry, we'll guide you all the way!")}</Paragraph>
          <Divider />
          <Title className="ttu mb4">{t("learn.cooperation.title", "Cooperation")}</Title>
          <Paragraph>
            {t(
              "learn.cooperation.1",
              "Hanabi is a cooperative game.\n\nYou play with other players to reach a common goal."
            )}
          </Paragraph>
        </>
      ),
    },

    {
      html: (
        <>
          <Title className="ttu mb4">{t("learn.cards.title", "Cards")}</Title>
          <Paragraph>
            <Trans key="learn.cards.1">
              Cards are numbered from {vignette("number", 1)} to {vignette("number", 5)} and colored{" "}
              <span className="txt-red">red</span>, <span className="txt-yellow">yellow</span>,{" "}
              <span className="txt-green">green</span>, <span className="txt-blue">blue</span> or{" "}
              <span className="txt-white">white</span>.
            </Trans>
          </Paragraph>
          <div className="mb3">
            {getColors(GameVariant.CLASSIC).map(color => {
              return (
                <div key={color} className="flex mt2">
                  {numbers.map(number => {
                    return (
                      <div key={number} className="flex items-center">
                        {card(color, number, CardSize.MEDIUM)}
                        <Txt className="lavender ml1 mr2" size={TxtSize.XSMALL} value={`x${amountPerNumber[number]}`} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* <div className="flex items-center mt2 lavender" onClick={() => setColorBlindMode(!colorBlindMode)}>
            (
            <Txt
              className="lavender mr2"
              size={TxtSize.XSMALL}
              value={t("learn.cards.colorBlind", "Having trouble seeing colors? Toggle color-blind mode")}
            />
            <Checkbox
              checked={colorBlindMode}
              onChange={e => {
                setColorBlindMode(e.target.checked);
              }}
            />
            )
          </div> */}
          <Divider />
          <Paragraph>{t("learn.cards.2", "At the start of the game, each player will be dealt 5 cards.")}</Paragraph>
          <Paragraph>
            {t("learn.cards.3", "You can't see your own cards, but you can see other players cards")}
          </Paragraph>
        </>
      ),
    },

    {
      html: (
        <>
          <Title className="ttu mb4">{t("learn.goal.title", "Goal")}</Title>
          <Paragraph>{t("learn.goal.1", "As a team, play all cards from each color.")}</Paragraph>
          <div className="mt3 flex items-center">
            <PlayedCards
              cards={[
                { color: IColor.BLUE, number: 1 },
                { color: IColor.BLUE, number: 2 },
                { color: IColor.BLUE, number: 3 },
                { color: IColor.BLUE, number: 4 },
                { color: IColor.BLUE, number: 5 },
                { color: IColor.GREEN, number: 1 },
                { color: IColor.GREEN, number: 2 },
                { color: IColor.GREEN, number: 3 },
                { color: IColor.WHITE, number: 1 },
                { color: IColor.YELLOW, number: 1 },
                { color: IColor.YELLOW, number: 2 },
                { color: IColor.YELLOW, number: 3 },
                { color: IColor.YELLOW, number: 4 },
              ]}
            />
            <Txt className="lavender ml2" size={TxtSize.XSMALL} value={t("5 + 3 + 1 + 4 = 13 / 25")} />
          </div>
          <div className="mt4">
            <Paragraph>
              <Trans key="learn.goal.2">
                Piles from each color must be built in ascending order. For instance, in the example above, you must
                play
                {card(IColor.GREEN, 4)} before playing {card(IColor.GREEN, 5)}.
              </Trans>
            </Paragraph>
          </div>
        </>
      ),
    },

    {
      html: (
        <>
          <Title className="ttu mb4">{t("learn.actions.title", "Actions")}</Title>
          <Paragraph className="nt4">{t("At your turn, you have the choice between 3 actions")}</Paragraph>

          <Subtitle className="ttu mt4 mb2">{t("learn.actions.play.title", "1. Play")}</Subtitle>
          <Paragraph>
            <Trans key="learn.actions.discard.1">
              Play a card from your hand on the board.
              <br />
              <br />
              If the card was not playable, the card is discarded and your team gains a strike token: {token("strikes")}
              <br />
              <br />
              Draw a new card from the deck.
            </Trans>
          </Paragraph>
          <Divider />
          <Subtitle className="ttu mb2">{t("learn.actions.discard.title", "2. Discard")}</Subtitle>
          <Paragraph>
            <Trans key="learn.actions.discard.2">
              Throw away a card from your hand. It will be lost forever.
              <br />
              <br />
              Gain one hint token: {token("hints")}
              <br />
              <br />
              Draw a new card from the deck.
            </Trans>
          </Paragraph>
        </>
      ),
    },

    {
      html: (
        <>
          <Title className="ttu mb4">{t("learn.actions", "Actions")}</Title>
          <Subtitle className="ttu mb2">{t("learn.actions.play", "3. Hint")}</Subtitle>
          <Paragraph>
            <Trans key="learn.actions.hint">
              Give indications about cards in one of your teammates hand.
              <br />
              <br />
              Giving a hint costs a hint token: {token("hints")}
              <br />
              <br />
              You can hint about one color or one value.
              <br />
              For instance, in the hand below:
              <div className="flex mt3 mb4">
                {card(IColor.BLUE, 2, CardSize.LARGE, 0)}
                {card(IColor.BLUE, 3, CardSize.LARGE, 1)}
                {card(IColor.RED, 2, CardSize.LARGE, 2)}
                {card(IColor.RED, 4, CardSize.LARGE, 3)}
                {card(IColor.YELLOW, 5, CardSize.LARGE, 4)}
              </div>
              You could give the following hints:
              <br />
              <span className="db mv1 lavender">“Your cards A & B are blue”</span>
              <span className="db mv1 lavender">“Your cards A & C are 2s”</span>
              <span className="db mv1 lavender">“Your card E is yellow”</span>
              <span className="db mv1 lavender">“You have no green cards”</span>
            </Trans>
          </Paragraph>
        </>
      ),
    },

    {
      html: (
        <>
          <Title className="ttu mb4">{t("learn.tokens", "Tokens")}</Title>
          <Paragraph>
            {token("hints", 1.5)}
            <br />
            Hint tokens allow you to give hints.
            <br />
            At the start of the game, your team has 8 tokens.
          </Paragraph>
          <Divider />
          <Paragraph>
            {token("strikes", 1.5)}
            <br />
            Strike tokens are gained when someone plays an unplayable card.
            <br />
            After reaching 3 strike tokens, you instantly lose the game.
          </Paragraph>
        </>
      ),
    },

    {
      html: (
        <>
          <Title className="ttu">{t("learn.ready.title", "Ready?")}</Title>
          <Paragraph>{t("learn.ready.1", "Let's jump into a game to try all this out!")}</Paragraph>
          <Divider />
          <Paragraph>
            {t(
              "learn.ready.2",
              "Hanabi is a game with endless options and possibilities. There is no right choice when playing."
            )}
          </Paragraph>
          <Paragraph>
            {t(
              "learn.ready.3",
              "This tutorial aims to help you understand a basic play style you'll be able to use with your friends."
            )}
          </Paragraph>
          <Paragraph>
            {t(
              "learn.ready.4",
              "The conventions mentionned afterwards are not part of the official rules, but rather a system some players created to be more efficient. If you'd like to discover those by yourself, you can leave this tutorial right now and jump right into a game."
            )}
          </Paragraph>
        </>
      ),
    },
  ];
};

const Step = posed.div({
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
});

export default function Learn() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = useSteps();
  const router = useRouter();
  const { t } = useTranslation();

  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === steps.length - 1;

  const onStartClick = async () => {
    const id = readableUniqueId();
    const game = newGame({
      id,
      playersCount: 3,
      variant: GameVariant.CLASSIC,
      seed: "tutorial",
      gameMode: GameMode.NETWORK,
      allowRollback: false,
      botsWait: 2000,
      colorBlindMode: false,
      hintsLevel: IGameHintsLevel.ALL,
      private: true,
      preventLoss: false,
      turnsHistory: true,
      tutorial: true,
    });

    await updateGame(game);

    logEvent("Game", "Tutorial created");

    router.push(`/${id}`);
  };

  return (
    <>
      <HomeButton className="absolute top-1 right-1 z-2" />

      <img
        alt="Hanabi cards game online"
        className="fixed top-0 right-0 w4 h4 ma4 o-50 "
        src={require("~/images/hanabi.png?size=256")}
      />

      <div className="relative flex items-center h-90 w-90 w-50-l center">
        <PoseGroup>
          {steps.map((step, i) => {
            return i === currentStep ? (
              <Step key={i} className="flex flex-column">
                {step.html}
              </Step>
            ) : null;
          })}
        </PoseGroup>
        <div className="absolute left-0 right-0 bottom-1 flex justify-between items-center mh2">
          <Txt className="lavender" size={TxtSize.XXSMALL} value={`${currentStep + 1} / ${steps.length}`} />
          <div>
            {canGoBack && (
              <Button
                void
                text={t("back", "Back")}
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                }}
              />
            )}
            {isLastStep && (
              <Button
                primary
                className="ml4"
                text={t("start", "Start!")}
                onClick={() => {
                  onStartClick();
                }}
              />
            )}
            {!isLastStep && (
              <Button
                className="ml4"
                text={t("next", "Next") + " ➤"}
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
