import classnames from "classnames";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import shortid from "shortid";

import GameActionsStats from "~/components/gameActionsStats";
import GameBoard from "~/components/gameBoard";
import GameStats from "~/components/gameStats";
import LoadingScreen from "~/components/loadingScreen";
import PlayerStats from "~/components/playerStats";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { GameContext } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import { newGame } from "~/lib/actions";
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

export default function Summary() {
  const network = useNetwork();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(null);

  const { gameId } = router.query;

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!gameId) return;

    return network.subscribeToGame(gameId as string, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame(game);
    });
  }, [gameId]);

  function onBackClick() {
    router.push(`/play?gameId=${gameId}`);
  }

  if (!game) {
    return <LoadingScreen />;
  }

  return (
    <GameContext.Provider value={game}>
      <div className="flex flex-column items-center mb5">
        <Button
          void
          className="absolute left-0 top-1"
          size={ButtonSize.MEDIUM}
          text="< Back"
          onClick={() => onBackClick()}
        />
        <Txt className="mt4" size={TxtSize.LARGE} value="Summary" />
        <div className="flex flex-column items-center mt4">
          <Txt size={TxtSize.MEDIUM} value="Our Hanabi game" />
          <Txt className="mt2" size={TxtSize.MEDIUM}>
            <span>{game.players.length} players</span>
            {game.options.variant === GameVariant.MULTICOLOR && <span className="ml1">with multicolors</span>}
            {game.options.variant === GameVariant.RAINBOW && <span className="ml1">with rainbow</span>}
            <span className="ml2">· Shuffle #{game.options.seed}</span>
          </Txt>
        </div>

        <Section title="Our result">
          <GameBoard />
        </Section>

        <Section title="Evolution">
          <Txt
            className="db mb3"
            size={TxtSize.SMALL}
            value="Follow the game history! Each players’s card are displayed whether they were playable, discardable or dangerous (a card that will lower your max possible score if you discard it, for ex a multicolor or a 5)."
          />
          <GameStats />
        </Section>

        <Section className="flex justify-center-l" title="Average actions per player">
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

        <Section title="Who gave the most hints?">
          <GameActionsStats />
        </Section>

        <Section className="tc" title="Try it out!">
          <div>
            <Txt value={`${game.players.length} players - ${game.options.variant} mode`} />
            <Button
              primary
              className="ml3"
              text="Try this shuffle"
              onClick={async () => {
                const nextGameId = shortid();
                const nextGame = newGame({
                  ...game.options,
                  id: nextGameId,
                });

                await network.updateGame(nextGame);

                router.push(`/play?gameId=${nextGame.id}`);
              }}
            />
          </div>
          <div className="mt4">
            <Txt>
              <span>You can also play with other setups and meet our AI on</span>
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
