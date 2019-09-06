import classnames from "classnames";
import { last } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import shortid from "shortid";

import ActionArea, {
  ActionAreaType,
  ISelectedArea
} from "~/components/actionArea";
import GameBoard from "~/components/gameBoard";
import LoadingScreen from "~/components/loadingScreen";
import Lobby, { BotEmojis } from "~/components/lobby";
import MenuArea from "~/components/menuArea";
import PlayersBoard from "~/components/playersBoard";
import Turn from "~/components/turn";
import { TutorialProvider } from "~/components/tutorial";
import Txt, { TxtSize } from "~/components/ui/txt";
import {
  commitAction,
  getMaximumPossibleScore,
  goBackToState,
  joinGame
} from "~/game/actions";
import play from "~/game/ai";
import IGameState, {
  fillEmptyValues,
  IGameStatus,
  IPlayer,
  ITurn
} from "~/game/state";
import {
  CurrentPlayerContext,
  GameContext,
  GameView,
  GameViewContext,
  SelfPlayerContext
} from "~/hooks/game";
import useNetwork from "~/hooks/network";

export default function Play() {
  const network = useNetwork();
  const router = useRouter();
  const [lastTurn, setLastTurn] = useState<ITurn>(null);
  const [game, setGame] = useState<IGameState>(null);
  const [view, setView] = useState<GameView>(GameView.LIVE);
  const [selectedArea, selectArea] = useState<ISelectedArea>({
    id: "instructions",
    type: ActionAreaType.INSTRUCTIONS
  });
  const { gameId, playerId } = router.query;

  const selfPlayer = game && game.players.find(p => p.id === playerId);
  const currentPlayer = game && game.players[game.currentPlayer];

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!gameId) return;

    return network.subscribeToGame(gameId as string, game => {
      if (view === GameView.PEAK) return;

      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [gameId, view]);

  /**
   * Display turn on turn played.
   * Also resets the selected area.
   */
  useEffect(() => {
    if (!game) return;

    setLastTurn(last(game.turnsHistory));
    selectArea({ id: "instructions", type: ActionAreaType.INSTRUCTIONS });
    const timeout = setTimeout(() => setLastTurn(null), 10000);

    return () => clearTimeout(timeout);
  }, [game && game.turnsHistory.length]);

  /**
   * Handle notification sounds.
   */
  useEffect(() => {
    if (!selfPlayer) return;
    if (!selfPlayer.notified) return;

    new Audio(`/static/sounds/bell.mp3`).play();
    const timeout = setTimeout(
      () => network.setNotification(game, selfPlayer, false),
      10000
    );

    return () => clearTimeout(timeout);
  }, [selfPlayer && selfPlayer.notified]);

  /**
   * Play for bots.
   */
  useEffect(() => {
    if (!game) return;
    if (!game.synced) return;
    if (game.status !== IGameStatus.ONGOING) return;
    if (!selfPlayer || selfPlayer.index) return;
    if (!currentPlayer.bot) return;

    if (game.options.botsWait === 0) {
      network.updateGame(play(game));
      return;
    }

    network.setReaction(game, currentPlayer, "🧠");
    const timeout = setTimeout(() => {
      network.updateGame(play(game));
      game.options.botsWait && network.setReaction(game, currentPlayer, null);
    }, game.options.botsWait);

    return () => clearTimeout(timeout);
  }, [game && game.currentPlayer, game && game.status, game && game.synced]);

  function onJoinGame(player) {
    const playerId = shortid();

    network.updateGame(joinGame(game, { id: playerId, ...player }));

    router.replace({
      pathname: "/play",
      query: { gameId, playerId }
    });

    localStorage.setItem("gameId", gameId.toString());
    localStorage.setItem("playerId", playerId.toString());
  }

  function onAddBot() {
    const playerId = shortid();
    const botsCount = game.players.filter(p => p.bot).length;

    const bot = {
      emoji: BotEmojis[botsCount],
      name: `AI #${botsCount + 1}`
    };

    network.updateGame(joinGame(game, { id: playerId, ...bot, bot: true }));
  }

  async function onStartGame() {
    network.startGame(game);
  }

  async function onCommitAction(action) {
    const newState = commitAction(game, action);
    const misplay =
      getMaximumPossibleScore(game) !== getMaximumPossibleScore(newState);
    if (game.options.preventLoss && misplay) {
      if (!window.confirm("You fucked up · Keep going?")) {
        return;
      }
    }

    setGame({ ...newState, synced: false });
    network.updateGame(newState);
  }

  function onCloseArea() {
    selectArea({
      id: "instructions",
      type: ActionAreaType.INSTRUCTIONS
    });
  }

  function onImpersonate(player: IPlayer) {
    if (
      !window.confirm(
        `This will reveal your hand.\nContinue to ${player.name}'s side?`
      )
    ) {
      return;
    }

    router.push({
      pathname: "/play",
      query: { gameId, playerId: player.id }
    });
    onCloseArea();
  }

  async function onRollback() {
    network.updateGame(goBackToState(game));
  }

  async function onNotifyPlayer(player) {
    network.setNotification(game, player, true);
  }

  async function onReaction(reaction) {
    network.setReaction(game, selfPlayer, reaction);
  }

  /*
   * Area management functions
   */

  function onSelectArea(area: ISelectedArea) {
    if (area.id === selectedArea.id) {
      return selectArea({
        id: "instructions",
        type: ActionAreaType.INSTRUCTIONS
      });
    }

    selectArea(area);
  }

  function onSelectPlayer(player, cardIndex) {
    const self = player.id === selfPlayer.id;

    onSelectArea({
      id: self ? `game-${player.id}-${cardIndex}` : `game-${player.id}`,
      type: self ? ActionAreaType.SELF_PLAYER : ActionAreaType.OTHER_PLAYER,
      player,
      cardIndex
    });
  }

  function onSelectDiscard() {
    onSelectArea({
      id: "discard",
      type: ActionAreaType.DISCARD
    });
  }

  function onMenuClick() {
    onSelectArea({
      id: "menu",
      type: ActionAreaType.MENU
    });
  }

  function onTurnPeak(turn: number) {
    setGame(fillEmptyValues(goBackToState(game, turn)));
    setView(GameView.PEAK);
  }

  function onExitPeakMode() {
    setView(GameView.LIVE);
  }

  if (!game) {
    return <LoadingScreen />;
  }

  return (
    <TutorialProvider>
      <GameViewContext.Provider value={view}>
        <GameContext.Provider value={game}>
          <SelfPlayerContext.Provider value={selfPlayer}>
            <CurrentPlayerContext.Provider value={currentPlayer}>
              <div className="bg-main-dark relative flex flex-row w-100 h-100">
                {/* Toast */}
                <div
                  className="absolute z-999 bottom-1 left-0 right-0 flex justify-center items-center pointer"
                  style={{ pointerEvents: "none" }}
                >
                  {view === GameView.LIVE && lastTurn && (
                    <div
                      className="flex justify-center items-center bg-white main-dark br4 shadow-4 b--yellow ba bw2 pa2"
                      style={{ pointerEvents: "auto" }}
                      onClick={() => setLastTurn(null)}
                    >
                      <Turn
                        includePlayer={true}
                        showDrawn={
                          game.players[lastTurn.action.from] !== selfPlayer
                        }
                        turn={lastTurn}
                      />
                      <span className="ml4">&times;</span>
                    </div>
                  )}
                </div>

                {/* Peak mode */}
                {view === GameView.PEAK && (
                  <div
                    className="absolute z-999 bottom-1 right-1 bg-white main-dark br4 shadow-4 b--yellow ba bw2 pa2 pointer flex flex-column items-center"
                    onClick={onExitPeakMode}
                  >
                    <div className="flex w-100 mb1 justify-between items-center">
                      <Txt size={TxtSize.MEDIUM} value="Peak mode" />
                      <Txt className="mr2" value="×" />
                    </div>
                    <Txt
                      multiline
                      value="You are watching a snapshot of the game"
                    />
                  </div>
                )}

                {/* Left area */}
                <div
                  className={classnames(
                    "flex flex-column h-100 overflow-y-scroll pa1",
                    { "o-70": view === GameView.PEAK }
                  )}
                  style={{ minWidth: "35%" }}
                >
                  <PlayersBoard
                    onNotifyPlayer={onNotifyPlayer}
                    onReaction={onReaction}
                    onSelectPlayer={onSelectPlayer}
                  />
                </div>

                {/* Right area */}
                <div
                  className={classnames(
                    "flex flex-column h-100 flex-grow-1 overflow-y-scroll pa1 pl0",
                    { "o-70": view === GameView.PEAK }
                  )}
                >
                  <GameBoard
                    onMenuClick={onMenuClick}
                    onRollback={onRollback}
                    onSelectDiscard={onSelectDiscard}
                  />
                  <div className="flex-grow-1 pa2 pv4-l ph3-l shadow-5 br3 ba b--yellow-light">
                    {selectedArea.type === ActionAreaType.MENU && (
                      <MenuArea onCloseArea={onCloseArea} />
                    )}
                    {selectedArea.type !== ActionAreaType.MENU && (
                      <>
                        {game.status === IGameStatus.LOBBY && (
                          <Lobby
                            onAddBot={onAddBot}
                            onJoinGame={onJoinGame}
                            onStartGame={onStartGame}
                          />
                        )}
                        {game.status !== IGameStatus.LOBBY && (
                          <ActionArea
                            selectedArea={selectedArea}
                            onCloseArea={onCloseArea}
                            onCommitAction={onCommitAction}
                            onImpersonate={onImpersonate}
                            onSelectDiscard={onSelectDiscard}
                            onTurnPeak={onTurnPeak}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CurrentPlayerContext.Provider>
          </SelfPlayerContext.Provider>
        </GameContext.Provider>
      </GameViewContext.Provider>
    </TutorialProvider>
  );
}
