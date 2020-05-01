import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import GameActionsStats from "~/components/gameActionsStats";
import GameBoard from "~/components/gameBoard";
import GameStats from "~/components/gameStats";
import LoadingScreen from "~/components/loadingScreen";
import PlayerStats from "~/components/playerStats";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { GameContext } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import IGameState, { GameVariant } from "~/lib/state";

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
      <div className="flex flex-column items-center">
        <Button
          void
          className="absolute left-0 top-1"
          size={ButtonSize.MEDIUM}
          text="< Back"
          onClick={() => onBackClick()}
        />
        <Txt className="txt-yellow mt4" size={TxtSize.MEDIUM} value="Game summary" />
        <div className="flex flex-column items-center mt4">
          <Txt size={TxtSize.MEDIUM} value="Our Hanabi game" />
          <Txt className="mt1" size={TxtSize.MEDIUM}>
            <span>{game.players.length} players</span>
            {game.options.variant === GameVariant.MULTICOLOR && <span className="ml1">with multicolors</span>}
            {game.options.variant === GameVariant.RAINBOW && <span className="ml1">with rainbow</span>}
            <span className="ml1">· Shuffle #{game.options.seed}</span>
          </Txt>
        </div>
        <div className="mt4 w-100 flex flex-column items-center">
          <Txt size={TxtSize.MEDIUM} value="Our result" />
          <div className="mt2 w-100">
            <GameBoard />
          </div>
        </div>

        <div className="flex flex-column items-center mt4 w-100">
          <Txt size={TxtSize.MEDIUM} value="Evolution" />
          <div className="mt2 w-100">
            <GameStats />
          </div>
        </div>

        <div className="flex flex-column items-center mt4">
          <Txt size={TxtSize.MEDIUM} value="Average actions per player" />
          <div className="flex flex-wrap mt3">
            {game.players.map((player, i) => {
              return (
                <div key={i} className="flex flex-column items-center w-33 w-20-l">
                  <Txt value={player.name} />
                  <div className="mt2 mh4">
                    <PlayerStats player={player} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-column items-center mt4 w-100 w-75-m w-50-l">
          <Txt size={TxtSize.MEDIUM} value="Who gave the most hints?" />
          <div className="mt2 w-100">
            <GameActionsStats />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
}
