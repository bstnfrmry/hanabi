import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import posed, { PoseGroup } from "react-pose";
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
import Box from "~/components/ui/box";
import Txt, { TxtSize } from "~/components/ui/txt";
import {
  commitAction,
  getLastState,
  getMaximumPossibleScore,
  joinGame
} from "~/game/actions";
import play from "~/game/ai";
import IGameState, { fillEmptyValues, IPlayer, ITurn } from "~/game/state";
import { useDatabase } from "~/hooks/database";
import {
  CurrentPlayerContext,
  GameContext,
  SelfPlayerContext
} from "~/hooks/game";

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

  /**
   * Play for bots
   */
  useEffect(() => {
    db.ref(`/games/${gameId}/currentPlayer`).once("value", event => {
      if (
        !game ||
        game.status !== "ongoing" ||
        !selfPlayer ||
        selfPlayer.index
      ) {
        return;
      }

      const currentPlayer = game.players[event.val()];
      if (!currentPlayer || !currentPlayer.bot) {
        return;
      }

      db.ref(`/games/${gameId}/players/${currentPlayer.index}/reaction`).set(
        "🧠"
      );
      setTimeout(() => {
        db.ref(`/games/${gameId}`).set(play(game));
        db.ref(`/games/${gameId}/players/${currentPlayer.index}/reaction`).set(
          null
        );
      }, 3000);
    });
  }, [game, game ? game.currentPlayer : 0, selfPlayer]);

  async function onJoinGame(player) {
    const playerId = shortid();

    await db
      .ref(`/games/${gameId}`)
      .set(joinGame(game, { id: playerId, ...player, bot: false }));

    router.replace({
      pathname: "/play",
      query: { gameId, playerId }
    });

    localStorage.setItem("gameId", gameId.toString());
    localStorage.setItem("playerId", playerId.toString());
  }

  async function onAddBot() {
    const playerId = shortid();
    const botsCount = game.players.filter(p => p.bot).length;

    const bot = {
      emoji: BotEmojis[botsCount],
      name: `AI #${botsCount + 1}`
    };

    await db
      .ref(`/games/${gameId}`)
      .set(joinGame(game, { id: playerId, ...bot, bot: true }));
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

              {/* Reactions */}
              <div
                className="absolute z-999 right-1 h-100 w1 justify-center items-center pointer"
                style={{ pointerEvents: "none", top: "-200px" }}
              >
                <PoseGroup>
                  {Object.values(game.reactions).map((reaction, i) => (
                    <ReactionWrapper key={i}>
                      <Txt
                        className="absolute right-1"
                        size={TxtSize.LARGE}
                        value={reaction}
                      />
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
                  onNotifyPlayer={onNotifyPlayer}
                  onReaction={onReaction}
                  onSelectPlayer={onSelectPlayer}
                />
              </div>

              {/* Right area */}
              <div className="flex flex-column h-100 flex-grow-1 overflow-scroll pa1 pl0">
                <GameBoard
                  onMenuClick={onMenuClick}
                  onRollback={onRollback}
                  onSelectDiscard={onSelectDiscard}
                />
                <Box borderColor="yellow-light" className="flex-grow-1">
                  {selectedArea.type === ActionAreaType.MENU && (
                    <MenuArea onCloseArea={onCloseArea} />
                  )}
                  {selectedArea.type !== ActionAreaType.MENU && (
                    <>
                      {game.status === "lobby" && (
                        <Lobby
                          onAddBot={onAddBot}
                          onJoinGame={onJoinGame}
                          onStartGame={onStartGame}
                        />
                      )}
                      {game.status === "ongoing" && (
                        <ActionArea
                          selectedArea={selectedArea}
                          onCloseArea={onCloseArea}
                          onCommitAction={onCommitAction}
                          onImpersonate={onImpersonate}
                          onSelectDiscard={onSelectDiscard}
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
