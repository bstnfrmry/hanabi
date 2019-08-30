import React, { useState, useEffect } from "react";
import posed, { PoseGroup } from "react-pose";
import { useRouter } from "next/router";
import shortid from "shortid";

import IGameState, { fillEmptyValues, ITurn, IPlayer } from "~/game/state";
import {
  joinGame,
  commitAction,
  getLastState,
  getMaximumPossibleScore
} from "~/game/actions";
import { useDatabase } from "~/hooks/database";
import {
  GameContext,
  SelfPlayerContext,
  CurrentPlayerContext
} from "~/hooks/game";

import PlayersBoard from "~/components/playersBoard";
import GameBoard from "~/components/gameBoard";
import Lobby from "~/components/lobby";
import ActionArea, {
  ActionAreaType,
  ISelectedArea
} from "~/components/actionArea";
import LoadingScreen from "~/components/loadingScreen";
import Box from "~/components/ui/box";
import Turn, { TurnSize } from "~/components/turn";
import { TutorialProvider } from "~/components/tutorial";
import MenuArea from "~/components/menuArea";

const ReactionWrapper = posed.div({
  enter: { y: 0, transition: { ease: "easeOut", duration: 3500 } },
  exit: { y: 1000, transition: { ease: "easeOut", duration: 3500 } }
});

export default function Play() {
  const db = useDatabase();
  const router = useRouter();
  const [lastTurn, setLastTurn] = useState<ITurn>(null);
  const [game, setGame] = useState<IGameState>(null);
  const [selectedArea, selectArea] = useState<ISelectedArea>({
    id: "instructions",
    type: ActionAreaType.INSTRUCTIONS
  });
  const { gameId, playerId } = router.query;
  const selfPlayer = game && game.players.find(p => p.id === playerId);

  /**
   * Load game from database
   */
  useEffect(() => {
    db.ref(`/games/${gameId}`).on("value", event => {
      const snapshot = event.val();
      if (!snapshot) {
        router.push("/404");
      }
      setGame(fillEmptyValues(snapshot));
    });
  }, [gameId, playerId]);

  /**
   * Display turn on turn played. Also resets the selected area
   */
  useEffect(() => {
    let timeout;
    db.ref(`/games/${gameId}/turnsHistory`).on("child_added", event => {
      setLastTurn(event.val());
      selectArea({ id: "instructions", type: ActionAreaType.INSTRUCTIONS });

      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => setLastTurn(null), 80000);
    });
  }, [gameId]);

  /**
   * Handle notification sounds
   */
  useEffect(() => {
    if (!selfPlayer) {
      return;
    }

    const ref = db.ref(`/games/${gameId}/players/${selfPlayer.index}/notified`);
    ref.on("value", event => {
      const notified = event.val();
      if (notified) {
        if (notified !== selfPlayer.notified) {
          new Audio(`/static/sounds/bell.mp3`).play();
        }

        setTimeout(() => {
          ref.set(false);
        }, 10000);
      }
    });
  }, [gameId, playerId]);

  async function onJoinGame(player) {
    const playerId = shortid();

    await db
      .ref(`/games/${gameId}`)
      .set(joinGame(game, { id: playerId, ...player }));

    router.replace({
      pathname: "/play",
      query: { gameId, playerId }
    });

    localStorage.setItem("gameId", gameId.toString());
    localStorage.setItem("playerId", playerId.toString());
  }

  async function onStartGame() {
    await db.ref(`/games/${gameId}/status`).set("ongoing");
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

    await db.ref(`/games/${gameId}`).set(newState);
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
    await db.ref(`/games/${gameId}`).set(getLastState(game));
  }

  async function onNotifyPlayer(player) {
    await db.ref(`/games/${gameId}/players/${player.index}/notified`).set(true);
  }

  async function onReaction(reaction) {
    await db
      .ref(`/games/${gameId}/players/${selfPlayer.index}/reaction`)
      .set(reaction);

    await db.ref(`/games/${gameId}/reactions`).push(reaction);
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

  function onCloseArea() {
    selectArea({
      id: "instructions",
      type: ActionAreaType.INSTRUCTIONS
    });
  }

  if (!game) {
    return <LoadingScreen />;
  }

  return (
    <TutorialProvider>
      <GameContext.Provider value={game}>
        <SelfPlayerContext.Provider value={selfPlayer}>
          <CurrentPlayerContext.Provider
            value={game.players[game.currentPlayer]}
          >
            <div className="bg-main-dark relative flex flex-row w-100 h-100">
              {/* Toast */}
              <div
                className="absolute z-999 bottom-1 left-0 right-0 flex justify-center items-center pointer"
                style={{ pointerEvents: "none" }}
              >
                {lastTurn && (
                  <div
                    style={{ pointerEvents: "auto" }}
                    onClick={() => setLastTurn(null)}
                    className="flex justify-center items-center bg-white main-dark br4 shadow-4 b--yellow ba bw2 f4 pa2"
                  >
                    <Turn
                      size={TurnSize.SMALL}
                      includePlayer={true}
                      turn={lastTurn}
                      showDrawn={
                        game.players[lastTurn.action.from] !== selfPlayer
                      }
                    />
                    <span className="ml4">&times;</span>
                  </div>
                )}
              </div>

              {/* Reactions */}
              <div
                className="absolute z-999 right-1 h-100 w1 justify-center items-center pointer f1"
                style={{ pointerEvents: "none", top: "-200px" }}
              >
                <PoseGroup>
                  {Object.values(game.reactions).map((reaction, i) => (
                    <ReactionWrapper key={i}>
                      <span className="absolute right-1">{reaction}</span>
                    </ReactionWrapper>
                  ))}
                </PoseGroup>
              </div>

              {/* Left area */}
              <div
                className="flex flex-column h-100 overflow-y-scroll pa1"
                style={{ minWidth: "35%" }}
              >
                <PlayersBoard
                  onSelectPlayer={onSelectPlayer}
                  onNotifyPlayer={onNotifyPlayer}
                  onReaction={onReaction}
                />
              </div>

              {/* Right area */}
              <div className="flex flex-column h-100 flex-grow-1 overflow-scroll pa1 pl0">
                <GameBoard
                  onRollback={onRollback}
                  onMenuClick={onMenuClick}
                  onSelectDiscard={onSelectDiscard}
                />
                <Box className="flex-grow-1" borderColor="yellow-light">
                  {selectedArea.type === ActionAreaType.MENU && (
                    <MenuArea onCloseArea={onCloseArea} />
                  )}
                  {selectedArea.type !== ActionAreaType.MENU && (
                    <>
                      {game.status === "lobby" && (
                        <Lobby
                          onJoinGame={onJoinGame}
                          onStartGame={onStartGame}
                        />
                      )}
                      {game.status === "ongoing" && (
                        <ActionArea
                          selectedArea={selectedArea}
                          onCommitAction={onCommitAction}
                          onSelectDiscard={onSelectDiscard}
                          onCloseArea={onCloseArea}
                          onImpersonate={onImpersonate}
                        />
                      )}
                    </>
                  )}
                </Box>
              </div>
            </div>
          </CurrentPlayerContext.Provider>
        </SelfPlayerContext.Provider>
      </GameContext.Provider>
    </TutorialProvider>
  );
}
