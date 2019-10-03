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
import Lobby from "~/components/lobby";
import MenuArea from "~/components/menuArea";
import PlayersBoard from "~/components/playersBoard";
import { TutorialProvider } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import {
  commitAction,
  getMaximumPossibleScore,
  goBackToState,
  joinGame
} from "~/game/actions";
import play from "~/game/ai";
import IGameState, { GameMode, IGameStatus, IPlayer } from "~/game/state";
import {
  CurrentPlayerContext,
  GameContext,
  SelfPlayerContext
} from "~/hooks/game";
import useNetwork from "~/hooks/network";
import usePrevious from "~/hooks/previous";

export default function Play() {
  const network = useNetwork();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(null);
  const [interturn, setInterturn] = useState(false);
  const [selectedArea, selectArea] = useState<ISelectedArea>({
    id: "instructions",
    type: ActionAreaType.INSTRUCTIONS
  });
  const { gameId, playerId } = router.query;

  const currentPlayer = game && game.players[game.currentPlayer];

  let selfPlayer: IPlayer;
  if (game && game.options.gameMode === GameMode.NETWORK) {
    selfPlayer = game && game.players.find(p => p.id === playerId);
  } else {
    selfPlayer = currentPlayer;
  }

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!gameId) return;

    return network.subscribeToGame(gameId as string, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [gameId]);

  /**
   * Resets the selected area when a player plays.
   */
  useEffect(() => {
    if (!game) return;

    selectArea({ id: "instructions", type: ActionAreaType.INSTRUCTIONS });
  }, [game && game.turnsHistory.length]);

  /**
   * Toggle interturn state on new turn for pass & play
   */
  useEffect(() => {
    debugger;
    if (!game) return;
    if (game.options.gameMode !== GameMode.PASS_AND_PLAY) return;

    setInterturn(true);
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
   * Play sound when gaining a hint token
   */
  const hintsCount = game ? game.tokens.hints : 0;
  const previousHintsCount = usePrevious(hintsCount);
  useEffect(() => {
    const timeout = setTimeout(() => {
      new Audio(`/static/sounds/coin.mp3`).play();
    }, 500);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount + 1]);

  const turnsCount = game ? game.turnsHistory.length : 0;
  const previousTurnsCount = usePrevious(turnsCount);
  useEffect(() => {
    new Audio(`/static/sounds/rewind.mp3`).play();
  }, [turnsCount === previousTurnsCount - 1]);

  /**
   * Play sound when discarding a card
   */
  useEffect(() => {
    if (!game) return;

    new Audio(`/static/sounds/card-scrape.mp3`).play();
  }, [game && game.discardPile.length]);

  /**
   * Play sound when successfully playing a card
   */
  useEffect(() => {
    if (!game) return;

    const latestCard = last(game.playedCards);
    if (!latestCard) return;

    const path =
      latestCard.number === 5
        ? `/static/sounds/play-5.mp3`
        : `/static/sounds/play.mp3`;

    new Audio(path).play();
  }, [game && game.playedCards.length]);

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

    localStorage.setItem("gameId", gameId.toString());

    if (game.options.gameMode === GameMode.NETWORK) {
      router.replace({
        pathname: "/play",
        query: { gameId, playerId }
      });
      localStorage.setItem("playerId", playerId.toString());
    }
  }

  function onAddBot() {
    const playerId = shortid();
    const botsCount = game.players.filter(p => p.bot).length;

    const bot = {
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

  if (!game) {
    return <LoadingScreen />;
  }

  return (
    <TutorialProvider>
      <GameContext.Provider value={game}>
        <SelfPlayerContext.Provider value={selfPlayer}>
          <CurrentPlayerContext.Provider value={currentPlayer}>
            <div className="bg-main-dark relative flex flex-row w-100 h-100">
              {/* Left area */}
              {currentPlayer && interturn && (
                <div
                  className="flex flex-column items-center justify-center"
                  style={{ minWidth: "35%" }}
                >
                  <Txt
                    size={TxtSize.MEDIUM}
                    value={`It's ${currentPlayer.name}'s turn!`}
                  />
                  <Button
                    className="mt4"
                    size={ButtonSize.MEDIUM}
                    text={`Go !`}
                    onClick={() => setInterturn(false)}
                  />
                </div>
              )}

              {!interturn && (
                <div
                  className={classnames(
                    "flex flex-column h-100 overflow-y-scroll pa1"
                  )}
                  style={{ minWidth: "35%" }}
                >
                  <PlayersBoard
                    onNotifyPlayer={onNotifyPlayer}
                    onReaction={onReaction}
                    onSelectPlayer={onSelectPlayer}
                  />
                </div>
              )}

              {/* Right area */}
              <div
                className={classnames(
                  "flex flex-column h-100 flex-grow-1 overflow-y-scroll pa1 pl0"
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
                          interturn={interturn}
                          selectedArea={selectedArea}
                          onCloseArea={onCloseArea}
                          onCommitAction={onCommitAction}
                          onSelectDiscard={onSelectDiscard}
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
    </TutorialProvider>
  );
}
