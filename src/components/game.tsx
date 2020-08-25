import Fireworks from "fireworks-canvas";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { ActionAreaType, ISelectedArea } from "~/components/actionArea";
import DiscardArea from "~/components/discardArea";
import GameBoard from "~/components/gameBoard";
import Lobby from "~/components/lobby";
import Logs from "~/components/logs";
import MenuArea from "~/components/menuArea";
import PlayersBoard from "~/components/playersBoard";
import ReplayViewer from "~/components/replayViewer";
import RollbackArea from "~/components/rollbackArea";
import Tutorial, { ITutorialStep } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";
import useLocalStorage from "~/hooks/localStorage";
import { useNotifications } from "~/hooks/notifications";
import usePrevious from "~/hooks/previous";
import { useReplay } from "~/hooks/replay";
import { useSession } from "~/hooks/session";
import { useSoundEffects } from "~/hooks/sounds";
import { commitAction, getMaximumPossibleScore, getScore, joinGame, newGame, recreateGame } from "~/lib/actions";
import { play } from "~/lib/ai";
import { cheat } from "~/lib/ai-cheater";
import { logEvent } from "~/lib/analytics";
import { setNotification, setReaction, updateGame } from "~/lib/firebase";
import { uniqueId } from "~/lib/id";
import IGameState, { GameMode, IGameHintsLevel, IGameStatus } from "~/lib/state";

interface Props {
  host: string;
  onGameChange: (game: IGameState) => void;
}

export function Game(props: Props) {
  const { host, onGameChange } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const [displayStats, setDisplayStats] = useState(false);
  const [reachableScore, setReachableScore] = useState<number>(null);
  const [interturn, setInterturn] = useState(false);
  const { playerId } = useSession();
  const [, setGameId] = useLocalStorage("gameId", null);
  const [selectedArea, selectArea] = useState<ISelectedArea>({
    id: "logs",
    type: ActionAreaType.LOGS,
  });
  const fireworksRef = useRef();

  const game = useGame();
  const currentPlayer = useCurrentPlayer();
  const selfPlayer = useSelfPlayer();
  const replay = useReplay();

  useNotifications();
  useSoundEffects();

  /**
   * Resets the selected area when a player plays.
   */
  useEffect(() => {
    selectArea({ id: "logs", type: ActionAreaType.LOGS });
  }, [game.turnsHistory.length]);

  /**
   * Toggle interturn state on new turn for pass & play
   */
  useEffect(() => {
    if (game.options.gameMode !== GameMode.PASS_AND_PLAY) return;
    if (game.players.length < game.options.playersCount) return;
    if (game.status !== IGameStatus.ONGOING) return;

    setInterturn(true);
  }, [game.turnsHistory.length, game.players.length, game.status]);

  /**
   * Play for bots.
   */
  useEffect(() => {
    if (!game.synced) return;
    if (game.status !== IGameStatus.ONGOING) return;
    if (!selfPlayer || selfPlayer.index) return;
    if (!currentPlayer.bot) return;

    if (game.options.botsWait === 0) {
      updateGame(play(game));
      return;
    }

    setReaction(game, currentPlayer, "🧠");
    const timeout = setTimeout(() => {
      updateGame(play(game));
      game.options.botsWait && setReaction(game, currentPlayer, null);
    }, game.options.botsWait);

    return () => clearTimeout(timeout);
  }, [game.currentPlayer, game.status, game.synced]);

  /**
   * At the start of the game, compute and store the maximum score
   * that our cheating AI can achieve.
   */
  useEffect(() => {
    if (![IGameStatus.ONGOING, IGameStatus.OVER].includes(game.status)) return;

    let sameGame = newGame({
      id: game.id,
      playersCount: game.options.playersCount,
      variant: game.options.variant,
      allowRollback: false,
      preventLoss: false,
      seed: game.options.seed,
      private: true,
      hintsLevel: IGameHintsLevel.NONE,
      botsWait: 1000,
      turnsHistory: false,
      gameMode: GameMode.NETWORK,
      colorBlindMode: game.options.colorBlindMode,
    });

    game.players.forEach(player => {
      sameGame = joinGame(sameGame, {
        id: player.id,
        name: player.name,
        bot: true,
      });
    });

    while (sameGame.status !== IGameStatus.OVER) {
      sameGame = cheat(sameGame);
    }

    setReachableScore(getScore(sameGame));
  }, [game.status]);

  /**
   * Track when the game ends
   */
  useEffect(() => {
    if (game.status !== IGameStatus.OVER) return;

    logEvent("Game", "Game over");
  }, [game.status]);

  /**
   * Display fireworks animation when game ends
   */
  useEffect(() => {
    if (game.status !== IGameStatus.OVER) return;

    const fireworks = new Fireworks(fireworksRef.current, {
      maxRockets: 5, // max # of rockets to spawn
      rocketSpawnInterval: 150, // milliseconds to check if new rockets should spawn
      numParticles: 100, // number of particles to spawn when rocket explodes (+0-10)
      explosionMinHeight: 10, // minimum percentage of height of container at which rockets explode
      explosionChance: 1, // chance in each tick the rocket will explode
    });
    fireworks.start();

    const timeout = setTimeout(() => {
      fireworks.stop();
    }, game.playedCards.length * 200); // stop rockets from spawning

    return () => clearTimeout(timeout);
  }, [game.status]);

  /**
   * Redirect players to next game
   */
  const previousNextGameId = usePrevious(game ? game.nextGameId : null);
  useEffect(() => {
    if (!game.nextGameId) return;
    if (!previousNextGameId) return;

    setDisplayStats(false);
    router.push(`/${game.nextGameId}`);
  }, [game.nextGameId]);

  function onJoinGame(player) {
    const newState = joinGame(game, { id: playerId, ...player });

    onGameChange({ ...newState, synced: false });
    updateGame(newState);

    logEvent("Game", "Player joined");

    setGameId(game.id);
  }

  function onAddBot() {
    const playerId = uniqueId();
    const botsCount = game.players.filter(p => p.bot).length;

    const bot = {
      name: `AI #${botsCount + 1}`,
    };
    const newState = joinGame(game, { id: playerId, ...bot, bot: true });

    onGameChange({ ...newState, synced: false });
    updateGame(newState);

    logEvent("Game", "Bot added");
  }

  async function onStartGame() {
    const newState = {
      ...game,
      status: IGameStatus.ONGOING,
      startedAt: Date.now(),
    };

    onGameChange({ ...newState, synced: false });
    updateGame(newState);

    logEvent("Game", "Game started");
  }

  async function onCommitAction(action) {
    const newState = commitAction(game, action);

    const misplay = getMaximumPossibleScore(game) !== getMaximumPossibleScore(newState);
    if (game.options.preventLoss && misplay) {
      if (!window.confirm(t("preventLossContent"))) {
        return;
      }
    }

    if (game.options.gameMode === GameMode.PASS_AND_PLAY) {
      setInterturn(true);
    }

    onGameChange({ ...newState, synced: false });
    updateGame(newState);

    logEvent("Game", "Turn played");
  }

  function onCloseArea() {
    selectArea({
      id: "logs",
      type: ActionAreaType.LOGS,
    });
  }

  function onRollbackClick() {
    onSelectArea({
      id: "rollback",
      type: ActionAreaType.ROLLBACK,
    });

    logEvent("Game", "Game rolled back");
  }

  async function onNotifyPlayer(player) {
    setNotification(game, player, true);
  }

  async function onReaction(reaction) {
    setReaction(game, selfPlayer, reaction);
  }

  function onSelectArea(area: ISelectedArea) {
    if (area.id === selectedArea.id) {
      return selectArea({
        id: "logs",
        type: ActionAreaType.LOGS,
      });
    }

    selectArea(area);
  }

  function onSelectPlayer(player, cardIndex) {
    const self = player.id === selfPlayer?.id;

    if (displayStats) {
      return;
    }

    onSelectArea({
      id: self ? `game-${player.id}-${cardIndex}` : `game-${player.id}`,
      type: self ? ActionAreaType.SELF_PLAYER : ActionAreaType.OTHER_PLAYER,
      player,
      cardIndex,
    });
  }

  function onMenuClick() {
    onSelectArea({
      id: "menu",
      type: ActionAreaType.MENU,
    });
  }

  function onReplay() {
    setDisplayStats(false);
    replay.moveCursor(game.turnsHistory.length);

    logEvent("Game", "Replay opened");
  }

  function onReplayCursorChange(replayCursor: number) {
    replay.moveCursor(replayCursor);
  }

  function onStopReplay() {
    replay.moveCursor(null);
  }

  function onToggleStats() {
    setDisplayStats(!displayStats);

    selectArea({
      id: "logs",
      type: ActionAreaType.LOGS,
    });
  }

  async function onRestartGame() {
    const nextGame = recreateGame(game);

    await updateGame(nextGame);

    updateGame({
      ...game,
      nextGameId: nextGame.id,
    });

    logEvent("Game", "Game recreated");
  }

  return (
    <>
      <div className="game bg-main-dark relative flex flex-column w-100 h-100">
        <div className="bg-black-50 pa2 pv2-l ph6.5-m">
          <GameBoard onMenuClick={onMenuClick} onRollbackClick={onRollbackClick} />
        </div>
        <div className="flex flex-column bg-black-50 bb b--yellow ph6.5-m">
          {selectedArea.type === ActionAreaType.MENU && <MenuArea onCloseArea={onCloseArea} />}

          {game.status === IGameStatus.LOBBY && (
            <Lobby host={host} onAddBot={onAddBot} onJoinGame={onJoinGame} onStartGame={onStartGame} />
          )}

          {selectedArea.type === ActionAreaType.ROLLBACK && (
            <div className="h4 pa2 ph3-l">
              <RollbackArea onCloseArea={onCloseArea} />
            </div>
          )}

          {game.status !== IGameStatus.LOBBY && selectedArea.type !== ActionAreaType.ROLLBACK && (
            <div className="h4 pt0-l overflow-y-scroll">
              <div className="flex justify-between h-100 pa1 pa2-l">
                <Logs interturn={interturn} />
                <div className="flex flex-column justify-between items-end">
                  <Tutorial placement="left" step={ITutorialStep.DISCARD_PILE}>
                    <DiscardArea />
                  </Tutorial>
                  <Button
                    void
                    size={ButtonSize.TINY}
                    text={replay.cursor === null ? t("rewind") : t("backToGame")}
                    onClick={() => {
                      if (replay.cursor === null) {
                        onReplay();
                      } else {
                        onStopReplay();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {interturn && (
          <div className="flex-grow-1 flex flex-column items-center justify-center">
            <Txt size={TxtSize.MEDIUM} value={t("theirTurn", { currentPlayerName: currentPlayer.name })} />
            <Button
              primary
              className="mt4"
              size={ButtonSize.MEDIUM}
              text={t("go")}
              onClick={() => setInterturn(false)}
            />
          </div>
        )}
        {!interturn && (
          <div className="flex flex-grow-1 flex-column">
            <div className="h-100">
              <PlayersBoard
                displayStats={displayStats}
                selectedArea={selectedArea}
                onCloseArea={onCloseArea}
                onCommitAction={onCommitAction}
                onNotifyPlayer={onNotifyPlayer}
                onReaction={onReaction}
                onSelectPlayer={onSelectPlayer}
              />
            </div>
          </div>
        )}

        {game.status === IGameStatus.ONGOING && replay.cursor !== null && (
          <div className="flex flex-column bg-black-50 bt b--yellow pv3 ph6.5-m">
            <ReplayViewer onReplayCursorChange={onReplayCursorChange} onStopReplay={onStopReplay} />
          </div>
        )}

        {game.status === IGameStatus.OVER && (
          <div className="flex flex-column bg-black-50 bt b--yellow pv3 ph6.5-m">
            {replay.cursor !== null && (
              <ReplayViewer onReplayCursorChange={onReplayCursorChange} onStopReplay={onStopReplay} />
            )}

            {replay.cursor === null && (
              <div>
                <div className="flex flex-column flex-row-l justify-between items-center w-100 pb2 ph2 ph0-l">
                  <div className="w-100 w-60-l">
                    <Txt
                      className="db"
                      size={TxtSize.MEDIUM}
                      value={t("gameOver", { playedCardsLength: game.playedCards.length })}
                    />
                    {reachableScore && (
                      <Txt
                        multiline
                        className="db mt1 lavender"
                        size={TxtSize.SMALL}
                        value={
                          t("estimatedMaxScore", { reachableScore }) +
                          ` ` +
                          (reachableScore > game.playedCards.length ? t("keepPracticing") : t("congrats"))
                        }
                      />
                    )}
                  </div>
                  <div className="flex w-100 w-40-l flex-wrap items-start mt2 mt0-l">
                    <div className="flex w-100-l">
                      <Button
                        primary
                        className="nowrap ma1 flex-1"
                        size={ButtonSize.TINY}
                        text={t("newGame")}
                        onClick={() => onRestartGame()}
                      />
                    </div>
                    <div className="flex w-100-l">
                      <Button
                        outlined
                        className="nowrap ma1 flex-1"
                        size={ButtonSize.TINY}
                        text={displayStats ? t("hideStats") : t("showStats")}
                        onClick={() => onToggleStats()}
                      />
                      <Button
                        outlined
                        className="nowrap ma1 flex-1"
                        size={ButtonSize.TINY}
                        text={t("summary")}
                        onClick={() => {
                          router.push(`/${game.id}/summary`);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Txt className="db tc" size={TxtSize.SMALL}>
                  <Trans i18nKey="buymeacoffeePostGame">
                    Support the game,{" "}
                    <a
                      className="lavender"
                      href="https://www.buymeacoffee.com/hanabicards"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      buy us a coffee
                    </a>
                  </Trans>
                </Txt>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={fireworksRef} className="fixed absolute--fill z-999" style={{ pointerEvents: "none" }} />
    </>
  );
}
