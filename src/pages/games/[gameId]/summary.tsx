import classnames from "classnames";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import GameActionsStats from "~/components/gameActionsStats";
import GameBoard from "~/components/gameBoard";
import GameStats from "~/components/gameStats";
import LoadingScreen from "~/components/loadingScreen";
import PlayerStats from "~/components/playerStats";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { GameContext } from "~/hooks/game";
import { useRequireName } from "~/hooks/useRequireName";
import { newGame } from "~/lib/actions";
import { subscribeToGame, updateGame } from "~/lib/firebase";
import { uniqueId } from "~/lib/id";
import IGameState, { GameVariant } from "~/lib/state";
import { logFailedPromise } from "~/lib/errors";

interface SectionProps {
  children: ReactNode;
  title: string;
  className?: string;
}

function Section(props: SectionProps) {
  const { children, className, title } = props;

  return (
    <div className="mt4 w-100 flex flex-column">
      <div className="w-100 bg-black-50 pt3 pb3 bb bt b--yellow">
        <Txt className="ttu pl3 pr0 ph6.5-m ph8-l" size={TxtSize.MEDIUM} value={title} />
      </div>
      <div
        className={classnames("mt3 mt4-l w-100 pv1 ph3 ph6.5-m ph8-l mr4 mr0-m", className)}
        style={{ maxWidth: "100vw", overflowX: "scroll", overflowY: "visible" }}
      >
        {children}
      </div>
    </div>
  );
}

function formatDuration(start: number, end: number) {
  const totalSeconds = Math.floor((end - start) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function Summary() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  useRequireName();
  const [game, setGame] = useState<IGameState | null>(null);
  const { t } = useTranslation();

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!gameId) return;

    return subscribeToGame(gameId, (game) => {
      if (!game) {
        return router.push("/404");
      }

      setGame(game);
    });
  }, [gameId, router]);

  function onBackClick() {
    router.push(`/games/${game.id}`).catch(logFailedPromise);
  }

  function gameVariantToText(gameVariant: GameVariant) {
    switch (gameVariant) {
      case GameVariant.CLASSIC:
        return t("classicVariant");
      case GameVariant.MULTICOLOR:
        return t("multicolorVariant");
      case GameVariant.MULTICOLOR6:
        return t("multicolor6Variant");
      case GameVariant.RAINBOW:
        return t("rainbowVariant");
      case GameVariant.CRITICAL_RAINBOW:
        return t("criticalRainbowVariant");
      case GameVariant.ORANGE:
        return t("orangeVariant");
      case GameVariant.SEQUENCE:
        return t("sequenceVariant");
      default:
        return "UNKNOWN";
    }
  }

  if (!game) {
    return <LoadingScreen />;
  }

  const gameDuration = game.startedAt && game.endedAt ? formatDuration(game.startedAt, game.endedAt) : null;

  return (
    <GameContext.Provider value={game}>
      <div className="flex flex-column items-center mb5 w-100">
        <div className="relative flex items-center justify-center w-100 mt3">
          <Button
            void
            className="absolute left-0"
            size={ButtonSize.MEDIUM}
            text={`< ${t("back")}`}
            onClick={() => onBackClick()}
          />
          <Txt size={TxtSize.LARGE} value={t("summary")} />
        </div>
        <div className="flex flex-column items-center mt4 w-100 ph3">
          <Txt size={TxtSize.MEDIUM} value={t("summarySubtitle")} />
          <Txt className="mt2 tc" size={TxtSize.MEDIUM} style={{ overflowWrap: "anywhere" }}>
            <Trans i18nKey="partySetup">
              Players: {{ players: game.players.length }} · Mode: {{ variant: gameVariantToText(game.options.variant) }}{" "}
              · Shuffle #{{ shuffle: game.options.seed }}
            </Trans>
          </Txt>
          {gameDuration && <Txt className="mt2" size={TxtSize.MEDIUM} value={t("gameCompleted", { gameDuration })} />}
        </div>

        <Section title={t("result")}>
          <GameBoard />
        </Section>

        <Section title={t("evolution")}>
          <Txt className="db mb3" size={TxtSize.SMALL} value={t("evolutionSubtext")} />
          <GameStats />
        </Section>

        <Section className="flex justify-center-l" title={t("playerActions")}>
          {game.players.map((player, i) => {
            return (
              <div key={i} className="flex flex-column items-center mh3 mh4-m">
                <Txt value={player.name} />
                <div className="mt2 mh2">
                  <PlayerStats player={player} />
                </div>
              </div>
            );
          })}
        </Section>

        <Section title={t("playerHints")}>
          <GameActionsStats />
        </Section>

        <Section className="tc" title={t("tryOutTitle")}>
          <div style={{ overflowWrap: "anywhere" }}>
            <Trans i18nKey="partySetup">
              Players: {{ players: game.players.length }} · Mode: {{ variant: gameVariantToText(game.options.variant) }}{" "}
              · Shuffle #{{ shuffle: game.options.seed }}
            </Trans>
            <Button
              primary
              className="ml3"
              text={t("tryOutButton")}
              onClick={async () => {
                const nextGameId = uniqueId();
                const nextGame = newGame({
                  ...game.options,
                  id: nextGameId,
                });

                await updateGame(nextGame);
                await updateGame({ ...game, nextGameId: nextGameId });

                await router.push(`/games/${nextGame.id}`);
              }}
            />
          </div>
          <div className="mt4">
            <Txt>
              <Trans i18nKey="tryOutAlternative">
                You can also play with other setups and meet our AI on
                <a className="lavender" href="https://hanab.cards">
                  hanab.cards
                </a>
              </Trans>
            </Txt>
          </div>
        </Section>
      </div>
    </GameContext.Provider>
  );
}
