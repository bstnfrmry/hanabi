import { last, omit } from "lodash";
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
import { playSound } from "~/game/sound";
import IGameState, { GameMode, IGameStatus, IPlayer } from "~/game/state";
import useConnectivity from "~/hooks/connectivity";
import { GameContext, SelfPlayerContext } from "~/hooks/game";
import useNetwork from "~/hooks/network";
import usePrevious from "~/hooks/previous";

export default function Play() {
  const network = useNetwork();
  const router = useRouter();
  const online = useConnectivity();
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
   * Request notification permissions when game starts
   */
  useEffect(() => {
    if (!game) return;
    if (game.status !== IGameStatus.ONGOING) return;

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [game && game.status === IGameStatus.ONGOING]);

  /**
   * Load game from database
   */
  useEffect(() => {
    if (!online) return;
    if (!gameId) return;

    return network.subscribeToGame(gameId as string, game => {
      if (!game) {
        return router.push("/404");
      }

      setGame({ ...game, synced: true });
    });
  }, [gameId, online]);

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
    if (!game) return;
    if (game.options.gameMode !== GameMode.PASS_AND_PLAY) return;
    if (game.players.length < game.options.playersCount) return;
    if (game.status !== IGameStatus.ONGOING) return;

    setInterturn(true);
  }, [
    game && game.turnsHistory.length,
    game && game.players.length,
    game && game.status
  ]);

  /**
   * Notify player it's time to play when document isn't focused.
   */
  useEffect(() => {
    if (!currentPlayer) return;
    if (currentPlayer !== selfPlayer) return;
    if (document.hasFocus()) return;

    const title = "Your turn!";
    const options = {
      icon: "/static/hanabi-192.png"
    };

    try {
      // Attempt sending the notification through the Web API.
      const notification = new Notification(title, options);

      const onNotificationClick = () => {
        window.focus();
        notification.close();
      };

      let closeTimeout;
      notification.onshow = () => {
        closeTimeout = setTimeout(() => {
          notification.close.bind(notification);
        }, 20000);
      };

      notification.addEventListener("click", onNotificationClick);

      return () => {
        notification.removeEventListener("click", onNotificationClick);

        if (closeTimeout) {
          clearTimeout(closeTimeout);
        }
      };
    } catch (e) {
      // Not handled for many mobile browsers.
    }
  }, [currentPlayer === selfPlayer]);

  /**
   * Handle notification sounds.
   */
  useEffect(() => {
    if (!selfPlayer) return;
    if (!selfPlayer.notified) return;

    playSound(`/static/sounds.bell.mp3`);
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
      playSound(`/static/sounds/coin.mp3`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount + 1]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      playSound(`/static/sounds/swoosh.wav`);
    }, 200);

    return () => clearTimeout(timeout);
  }, [hintsCount === previousHintsCount - 1]);

  const turnsCount = game ? game.turnsHistory.length : 0;
  const previousTurnsCount = usePrevious(turnsCount);
  useEffect(() => {
    playSound(`/static/sounds/rewind.mp3`);
  }, [turnsCount === previousTurnsCount - 1]);

  /**
   * Play sound when discarding a card
   */
  useEffect(() => {
    if (!game) return;

    playSound(`/static/sounds/card-scrape.mp3`);
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

    playSound(path);
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
    const newState = joinGame(game, { id: playerId, ...player });

    setGame({ ...newState, synced: false });
    network.updateGame(newState);

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
    const newState = joinGame(game, { id: playerId, ...bot, bot: true });

    setGame({ ...newState, synced: false });
    network.updateGame(newState);
  }

  async function onStartGame() {
    const newState = {
      ...game,
      status: IGameStatus.ONGOING
    };

    setGame({ ...newState, synced: false });
    network.updateGame(newState);
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

    if (game.options.gameMode === GameMode.PASS_AND_PLAY) {
      setInterturn(true);
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

  function onShowRollback() {
    return selectArea({
      id: "rollback",
      type: ActionAreaType.ROLLBACK
    });
  }

  async function onRollback() {
    let lastNonAI = 1;
    // check whether the previous player is a bot
    // adding players length to avoid a negative mod
    let checkedPlayer =
      (game.players.length + game.currentPlayer - 1) % game.players.length;
    while (game.players[checkedPlayer].bot && lastNonAI < game.players.length) {
      lastNonAI += 1;
      // check the player even before
      checkedPlayer =
        (game.currentPlayer + game.players.length - lastNonAI) %
        game.players.length;
    }

    network.updateGame(goBackToState(game, lastNonAI));
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

  function onReplay() {
    network.updateGame({
      ...game,
      replayCursor: game.turnsHistory.length - 1,
      synced: false
    });
  }

  function onReplayPrevious() {
    network.updateGame({
      ...game,
      replayCursor: game.replayCursor - 1,
      synced: false
    });
  }

  function onReplayNext() {
    network.updateGame({
      ...game,
      replayCursor: game.replayCursor + 1,
      synced: false
    });
  }

  function onStopReplay() {
    network.updateGame({
      ...omit(game, ["replayCursor"]),
      synced: false
    });
  }

  if (!game) {
    return <LoadingScreen />;
  }

  return (
    <TutorialProvider>
      <GameContext.Provider value={game}>
        <SelfPlayerContext.Provider value={selfPlayer}>
          <div className="bg-main-dark relative flex flex-column w-100 h-100">
            <GameBoard
              onMenuClick={onMenuClick}
              onSelectDiscard={onSelectDiscard}
              onShowRollback={onShowRollback}
            />

            <div className="flex flex-column  shadow-5 bg-black-50 bb b--yellow">
              {selectedArea.type === ActionAreaType.MENU ? (
                <div className="h4 pa2 ph3-l">
                  <MenuArea onCloseArea={onCloseArea} />
                </div>
              ) : game.status === IGameStatus.LOBBY ? (
                <Lobby
                  onAddBot={onAddBot}
                  onJoinGame={onJoinGame}
                  onStartGame={onStartGame}
                />
              ) : (
                <div className="h4 overflow-y-scroll pa2 ph3-l">
                  <ActionArea
                    interturn={interturn}
                    selectedArea={selectedArea}
                    onCloseArea={onCloseArea}
                    onReplay={onReplay}
                    onReplayNext={onReplayNext}
                    onReplayPrevious={onReplayPrevious}
                    onRollback={onRollback}
                    onSelectDiscard={onSelectDiscard}
                    onStopReplay={onStopReplay}
                  />
                </div>
              )}
            </div>

            {/* Top area */}
            {interturn && (
              <div className="flex-grow-1 flex flex-column items-center justify-center">
                <Txt
                  size={TxtSize.MEDIUM}
                  value={`It's ${currentPlayer.name}'s turn!`}
                />
                <Button
                  primary
                  className="mt4"
                  size={ButtonSize.MEDIUM}
                  text={`Go !`}
                  onClick={() => setInterturn(false)}
                />
              </div>
            )}

            {!interturn && (
              <div className="flex flex-column">
                <div className="h-100 overflow-y-scroll">
                  <PlayersBoard
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
          </div>
        </SelfPlayerContext.Provider>
      </GameContext.Provider>
    </TutorialProvider>
  );
}
