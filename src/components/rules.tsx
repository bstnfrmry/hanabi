import React, { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";

interface TxtProps {
  children: ReactNode;
}

const Title = (props: TxtProps) => (
  <Txt className="txt-yellow mt3" size={TxtSize.MEDIUM}>
    {props.children}
  </Txt>
);

const Subtitle = (props: TxtProps) => <Txt size={TxtSize.MEDIUM}>{props.children}</Txt>;

const Paragraph = (props: TxtProps) => <Txt className="mv2">{props.children}</Txt>;

interface Props {
  setShowRules: (showRules: boolean) => void;
}

export default function Rules(props: Props) {
  const { setShowRules } = props;
  const { t } = useTranslation();

  return (
    <div className="absolute bg-main-dark z-9999 aspect-ratio--object overflow-y-scroll flex justify-center pa4 relative tj lh-copy">
      <div className="w-75-l">
        <Button
          className="absolute left-2 top-1"
          size={ButtonSize.MEDIUM}
          text="<"
          onClick={() => setShowRules(false)}
        />
        <img alt="Hanabi cards game online" className="absolute top-0 right-0 mw4 ma4 o-50" src="/static/hanabi.png" />
        <div className="flex flex-column mb5">
          <Txt className="w-100 tc mt2 dib" size={TxtSize.LARGE} value={t("hanabi", "Hanabi")} />
          <Title>{t("objective", "Objective")}</Title>
          <Paragraph>{t("rulesIntro")}</Paragraph>
          <Paragraph>{t("rulesGoal")}</Paragraph>
          <Title>{t("rulesSetupTitle", "Setup")}</Title>
          <Paragraph>
            <Trans i18nKey="rulesSetup">
              The app sets up everything for you, which is handy 😉. At the beginning of a game, you will have 8 blue
              tokens - your hints - and 3 red tokens - your strike tokens.\nThe deck is composed of 50 cards, 10 of each
              color <span className="lavender">with numbers 1, 1, 1, 2, 2, 3, 3, 4, 4, 5</span>.\n· In a 2 or 3 player
              game, each player will be dealt 5 cards\n· In a 4 or 5 player game, each player will be dealt 4
              cards.\n\nAs you will see, players are not allowed to look at their own cards!
            </Trans>
          </Paragraph>
          <Title>{t("rulesGameTitle", "Playing the game")}</Title>
          <Paragraph>{t("rulesGame")}</Paragraph>
          <Subtitle>{t("rulesHintTitle", "1. Give information")}</Subtitle>
          <Paragraph>{t("rulesHint")}</Paragraph>
          <Subtitle>{t("rulesDiscardTitle", "2. Discard a card")}</Subtitle>
          <Paragraph>{t("rulesDiscard")}</Paragraph>
          <Subtitle>{t("rulesPlayTitle", "3. Play a card")}</Subtitle>
          <Paragraph>{t("rulesPlay")}</Paragraph>
          <Title>{t("rulesEndTitle", "End of the Game")}</Title>
          <Paragraph>{t("rulesEnd")}</Paragraph>
          <Title>{t("rulesExtensionTitle", "Extensions")}</Title>
          <Paragraph>{t("rulesExtensionMulticolor")}</Paragraph>
          <Paragraph>{t("rulesExtensionRainbow")}</Paragraph>
          <Txt className="w-100 ttu tc mt5 mb4 dib" size={TxtSize.LARGE} value={t("rulesUsTitle", "Who are we?")} />
          <Paragraph>
            <Trans i18nKey="rulesUs">
              We are a group of board-game addicts. Locked down in 2020, we were willing to find an alternative to play
              together remotely.\n Since we both have fun coding and playing Hanabi, we decided to create an online
              mobile-friendly version of the game.\n\n 👉 Like us, please buy the{" "}
              <a
                className="lavender"
                href="https://fr.asmodee.com/fr/games/hanabi/products/hanabi/"
                rel="noopener noreferrer"
                target="_blank"
              >
                physical version
              </a>{" "}
              to support its creator if you like this game!
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans i18nKey="rulesBuy">
              Don't hesitate to{" "}
              <a className="lavender" href="mailto:bastien.formery@gmail.com">
                contact us
              </a>{" "}
              if you have any question or suggestion.
              <br />
              We also have a{" "}
              <a
                className="lavender"
                href="https://github.com/bstnfrmry/hanabi/"
                rel="noopener noreferrer"
                target="_blank"
              >
                public Github repository
              </a>{" "}
              if you'd like to contribute.
            </Trans>
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
