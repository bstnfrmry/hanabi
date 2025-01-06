import Fireworks from "fireworks-canvas";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import Tutorial, { ITutorialStep, TutorialContext } from "~/components/tutorial";
import TutorialInstructions from "~/components/tutorialInstructions";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useCurrentPlayer, useGame, useSelfPlayer } from "~/hooks/game";
import useLocalStorage from "~/hooks/localStorage";
import { useNotifications } from "~/hooks/notifications";
import { useReplay } from "~/hooks/replay";
import { useSession } from "~/hooks/session";
import { useSoundEffects } from "~/hooks/sounds";
import { useUserPreferences } from "~/hooks/userPreferences";
import { commitAction, getMaximumPossibleScore, getScore, joinGame, newGame, recreateGame } from "~/lib/actions";
import { play } from "~/lib/ai";
import { cheat } from "~/lib/ai-cheater";
import { logEvent } from "~/lib/analytics";
import { loadGame, setNotification, setReaction, updateGame } from "~/lib/firebase";
import { uniqueId } from "~/lib/id";
import IGameState, { GameMode, IAction, IGameHintsLevel, IGameStatus, IPlayer } from "~/lib/state";
import { logFailedPromise } from "~/lib/errors";
import { log } from "react-fullstory";

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
  const currentPlayer = useCurrentPlayer(game);
  const selfPlayer = useSelfPlayer(game);
  const replay = useReplay();
  const tutorial = useContext(TutorialContext);
  const [userPreferences] = useUserPreferences();
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
  }, [game.turnsHistory.length, game.players.length, game.status, game.options.gameMode, game.options.playersCount]);

  /**
   * Play for bots.
   */
  useEffect(() => {
    if (!game.synced) return;
    if (game.status !== IGameStatus.ONGOING) return;
    if (!selfPlayer || selfPlayer.index) return;
    if (!currentPlayer.bot) return;

    if (game.options.botsWait === 0) {
      updateGame(play(game)).catch(logFailedPromise);
      return;
    }

    setReaction(game, currentPlayer, "🧠").catch(logFailedPromise);
    const timeout = setTimeout(() => {
      updateGame(play(game)).catch(logFailedPromise);
      game.options.botsWait && setReaction(game, currentPlayer, null);
    }, game.options.botsWait);

    return () => clearTimeout(timeout);
  }, [game.currentPlayer, game.status, game.synced, game, currentPlayer, selfPlayer]);

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

    game.players.forEach((player) => {
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
  }, [
    game.status,
    game.id,
    game.options.colorBlindMode,
    game.options.playersCount,
    game.options.seed,
    game.options.variant,
    game.players,
  ]);

  const fillBots = useCallback(async () => {
    let newState = game;
    const botsName = ["Jane", "Adam"];

    for (let i = 1; i < newState.options.playersCount; i++) {
      const playerId = uniqueId();

      newState = joinGame(newState, { id: playerId, name: botsName[i - 1] + " 🤖", bot: true });

      await updateGame(newState);
    }
  }, [game]);

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
    if (!userPreferences.showFireworksAtGameEnd) return;
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
  }, [game.status, game.playedCards.length, userPreferences.showFireworksAtGameEnd]);

  /**
   * Automatically start tutorial when player joins
   */
  const startTutorial = useCallback(() => {
    const newState = {
      ...game,
      status: IGameStatus.ONGOING,
      startedAt: Date.now(),
    };

    updateGame(newState).then(() => {
      logEvent("Game", "Tutorial started");
    });
  }, [game]);

  useEffect(() => {
    if (!game.options.tutorial) return;

    if (game.players.length === 1 && game.status === IGameStatus.LOBBY) {
      fillBots().catch(logFailedPromise);
    }
    if (game.players.length === game.options.playersCount && game.status === IGameStatus.LOBBY) {
      startTutorial();
    }
  }, [fillBots, startTutorial, game.players.length, game.options.tutorial, game.status, game.options.playersCount]);

  function changeToNextGame() {
    onStopReplay();
    const nextGameId = liveGame().nextGameId;
    setDisplayStats(false);
    const newUrl = `/${nextGameId}`;
    location.assign(newUrl);
  }

  /**
   * Redirect players to next game
   */
  useEffect(() => {
    if (!game.nextGameId) return;

    setDisplayStats(false);
  }, [game.nextGameId]);

  function onJoinGame(player: Omit<IPlayer, "id">) {
    const newState = joinGame(game, { id: playerId, ...player });

    onGameChange({ ...newState, synced: false });
    updateGame(newState).catch(logFailedPromise);

    logEvent("Game", "Player joined");

    setGameId(game.id);
  }

  function onAddBot() {
    const playerId = uniqueId();
    const botsCount = game.players.filter((p) => p.bot).length;

    const bot = {
      name: `AI #${botsCount + 1}`,
    };
    const newState = joinGame(game, { id: playerId, ...bot, bot: true });

    onGameChange({ ...newState, synced: false });
    updateGame(newState).catch(logFailedPromise);

    logEvent("Game", "Bot added");
  }

  async function onStartGame() {
    const newState = {
      ...game,
      status: IGameStatus.ONGOING,
      startedAt: Date.now(),
    };

    onGameChange({ ...newState, synced: false });
    await updateGame(newState);

    logEvent("Game", "Game started");
  }

  async function onCommitAction(action: IAction) {
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
    await updateGame(newState);

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

  async function onNotifyPlayer(player: IPlayer) {
    await setNotification(game, player, true);
  }

  async function onReaction(reaction: string) {
    await setReaction(game, selfPlayer, reaction);
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

  const onReplay = useCallback(() => {
    setDisplayStats(false);
    replay.moveCursor(game.turnsHistory.length);

    logEvent("Game", "Replay opened");
  }, [replay, game.turnsHistory.length]);

  const onReplayCursorChange = useCallback(
    (replayCursor: number) => {
      replay.moveCursor(replayCursor);
    },
    [replay]
  );

  const onStopReplay = useCallback(() => {
    replay.moveCursor(null);
  }, [replay]);

  function onToggleStats() {
    onStopReplay();
    setDisplayStats(!displayStats);

    selectArea({
      id: "logs",
      type: ActionAreaType.LOGS,
    });
  }

  /**
   * Catch some key pressed for replay mode
   */
  useEffect(() => {
    function checkKey(event: KeyboardEvent) {
      const cursor = replay.cursor;

      // left arrow: if hidden, display replay mode
      if (event.key === "ArrowLeft" && cursor === null) {
        onReplay();
      }
      // left arrow: slide the cursor to the left, if possible
      else if (event.key === "ArrowLeft" && cursor !== 0) {
        onReplayCursorChange(cursor - 1);
      }
      // right arrow: slide the cursor to the right, if possible
      else if (event.key === "ArrowRight" && cursor !== null && cursor !== game.originalGame?.turnsHistory?.length) {
        onReplayCursorChange(cursor + 1);
      }
      // escape: if replay displayed, remove replay
      else if (event.key === "Escape" && cursor !== null) {
        onStopReplay();
      }
    }

    window.addEventListener("keydown", checkKey);
    return () => {
      window.removeEventListener("keydown", checkKey);
    };
  }, [replay.cursor, game, onReplay, onReplayCursorChange, onStopReplay]);

  async function onRestartGame() {
    function log(message: string) {
      console.debug(`${Date.now()}: ${message}`);
    }
    onStopReplay();
    const finishedGame = liveGame();
    const nextGame = recreateGame(finishedGame);
    await updateGame(nextGame);
    log("Next Game Persisted");
    const updatedGame = { ...finishedGame, nextGameId: nextGame.id };
    await updateGame(updatedGame);
    log("Link to nextGame updated");
    onGameChange(nextGame);
    log(`GameChange fired for ${nextGame.id}`);
    logEvent("Game", "Next Game Created");
    await router.push(`/${nextGame.id}`);
    log("Router updated with new link");
  }
  function liveGame() {
    return game.originalGame || game;
  }
  const showNextGame = liveGame().nextGameId && true;

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
                    className="tracked-tight"
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

        {game.status === IGameStatus.ONGOING && game.options.tutorial && tutorial.isOver && <TutorialInstructions />}

        {replay.cursor !== null && (
          <div className="flex flex-column bg-black-50 bt b--yellow pv3 ph6.5-m">
            <ReplayViewer onReplayCursorChange={onReplayCursorChange} onStopReplay={onStopReplay} />
          </div>
        )}

        {liveGame().status === IGameStatus.OVER && (
          <div className="flex flex-column bg-black-50 bt b--yellow pv3 ph6.5-m">
            <div>
              <div className="flex flex-column flex-row-l justify-between items-center w-100 pb2 ph2 ph0-l">
                <div className="w-100 w-60-l">
                  <Txt
                    className="db"
                    size={TxtSize.MEDIUM}
                    value={t("gameOver", { playedCardsLength: liveGame().playedCards.length })}
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
                      text={t(showNextGame ? "nextGame" : "newGame")}
                      onClick={() => (showNextGame ? changeToNextGame() : onRestartGame())}
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
                        router.push(`/${game.id}/summary`).catch(logFailedPromise);
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
          </div>
        )}
      </div>

      <div ref={fireworksRef} className="fixed absolute--fill z-999" style={{ pointerEvents: "none" }} />
    </>
  );
}
