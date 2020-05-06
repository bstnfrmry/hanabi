import classnames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import shortid from "shortid";

import GameActionsStats from "~/components/gameActionsStats";
import GameBoard from "~/components/gameBoard";
import GameStats from "~/components/gameStats";
import PlayerStats from "~/components/playerStats";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import FirebaseNetwork, { setupFirebase } from "~/hooks/firebase";
import { GameContext } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import { Session } from "~/hooks/session";
import { newGame } from "~/lib/actions";
import { logEvent } from "~/lib/analytics";
import IGameState, { GameVariant } from "~/lib/state";

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
  return moment.utc(moment(end).diff(start)).format("HH:mm:ss");
}

export const getServerSideProps = async function({ params }) {
  const firebase = new FirebaseNetwork(setupFirebase());
  const game = await firebase.loadGame(params.gameId);

  return {
    props: {
      game,
    },
  };
};

interface Props {
  game: IGameState;
  session: Session;
}

export default function Summary(props: Props) {
  const { game: initialGame } = props;

  const network = useNetwork();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(initialGame);
  const { t } = useTranslation();

  /**
   * Load game from database
   */
  useEffect(() => {
    return network.subscribeToGame(game.id, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame(game);
    });
  }, [game.id]);

  function onBackClick() {
    router.push(`/${game.id}`);
  }

  function gameVariantToText(gameVariant) {
    switch (gameVariant) {
      case GameVariant.CLASSIC:
        return t("classicVariant");
        break;
      case GameVariant.MULTICOLOR:
        return t("multicolorVariant");
        break;
      case GameVariant.RAINBOW:
        return t("rainbowVariant");
        break;
      case GameVariant.ORANGE:
        return t("orangeVariant");
        break;
      default:
        return "UNKNOWN";
    }
  }

  const gameDuration = game.startedAt && game.endedAt ? formatDuration(game.startedAt, game.endedAt) : null;

  return (
    <GameContext.Provider value={game}>
      <div className="flex flex-column items-center mb5">
        <Button
          void
          className="absolute left-0 top-1"
          size={ButtonSize.MEDIUM}
          text={`< ${t("back")}`}
          onClick={() => onBackClick()}
        />
        <Txt className="mt4" size={TxtSize.LARGE} value={t("summary")} />
        <div className="flex flex-column items-center mt4">
          <Txt size={TxtSize.MEDIUM} value={t("summarySubtitle")} />
          <Txt className="mt2" size={TxtSize.MEDIUM}>
            <span>{`${t("players")}: ${game.players.length}`}</span>
            <span className="ml1">
              · {t("mode")}: {gameVariantToText(game.options.variant)}
            </span>
            <span className="ml2">
              · {t("shuffle")} #{game.options.seed}
            </span>
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
          <div>
            <Txt
              value={`${t("players")}: ${game.players.length} - ${t("mode")}: ${gameVariantToText(
                game.options.variant
              )}`}
            />
            <Button
              primary
              className="ml3"
              text={t("tryOutButton")}
              onClick={async () => {
                const nextGameId = shortid();
                const nextGame = newGame({
                  ...game.options,
                  id: nextGameId,
                });

                await network.updateGame(nextGame);

                logEvent("Game", "Game created");

                router.push(`/play?gameId=${nextGame.id}`);
              }}
            />
          </div>
          <div className="mt4">
            <Txt>
              <span>{t("tryOutAlternative")}</span>
              <a className="ml2 lavender" href="https://hanabi.cards">
                hanabi.cards
              </a>
            </Txt>
          </div>
        </Section>
      </div>
    </GameContext.Provider>
  );
}
