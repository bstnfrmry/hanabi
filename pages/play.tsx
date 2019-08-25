import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import PlayersBoard from "../components/playersBoard";
import GameBoard from "../components/gameBoard";
import Lobby from "../components/lobby";
import ActionArea, {
  ActionAreaType,
  ISelectedArea
} from "../components/areas/actionArea";
import { useDatabase } from "../hooks/database";
import {
  GameContext,
  SelfPlayerContext,
  CurrentPlayerContext
} from "../hooks/game";
import {
  joinGame,
  commitAction,
  getLastState,
  getMaximumPossibleScore
} from "../game/actions";

import IGameState, { fillEmptyValues } from "../game/state";

export default function Play() {
  const db = useDatabase();
  const router = useRouter();
  const [game, setGame] = useState<IGameState>(null);
  const [selectedArea, selectArea] = useState<ISelectedArea>({
    id: "instructions",
    type: ActionAreaType.INSTRUCTIONS
  });
  const { gameId, playerId } = router.query;

  const player =
    game && game.players && game.players.find(p => p.id === playerId);

  useEffect(() => {
    db.ref(`/games/${gameId}`).on("value", event => {
      setGame(fillEmptyValues(event.val()));
    });
  }, [gameId, playerId]);

  useEffect(() => {
    db.ref(`/games/${gameId}/currentPlayer`).on("value", event => {
      selectArea({
        id: "instructions",
        type: ActionAreaType.INSTRUCTIONS
      });
    });
  }, [gameId]);

  useEffect(() => {
    if (!player) {
      return;
    }

    const ref = db.ref(`/games/${gameId}/players/${player.index}/notified`);
    ref.on("value", event => {
      const notified = event.val();
      if (notified) {
        if (notified !== player.notified) {
          new Audio(`/static/sounds/bell.mp3`).play();
        }

        setTimeout(() => {
          ref.set(false);
        }, 10000);
      }
    });
  }, [gameId, playerId]);

  if (!game) {
    return "Loading";
  }

  async function onJoinGame(player) {
    const playerId = shortid();

    await db
      .ref(`/games/${gameId}`)
      .set(joinGame(game, { id: playerId, ...player }));

    router.replace({
      pathname: "/play",
      query: { gameId, playerId }
    });
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

  async function onRollback() {
    await db.ref(`/games/${gameId}`).set(getLastState(game));
  }

  function onMenuClick() {
    if (window.confirm("Back to menu?")) {
      router.push("/");
    }
  }

  function onLogsClick() {
    selectArea({
      id: "instructions",
      type: ActionAreaType.INSTRUCTIONS
    });
  }

  async function onNotifyPlayer(player) {
    await db.ref(`/games/${gameId}/players/${player.index}/notified`).set(true);
  }

  function onSelectArea(area: ISelectedArea) {
    if (area.id === selectedArea.id) {
      return selectArea({
        id: "instructions",
        type: ActionAreaType.INSTRUCTIONS
      });
    }

    selectArea(area);
  }

  return (
    <GameContext.Provider value={game}>
      <SelfPlayerContext.Provider value={player}>
        <CurrentPlayerContext.Provider value={game.players[game.currentPlayer]}>
          <div className="w-100 h-100">
            <div className="flex flex-row h-100">
              <PlayersBoard
                onSelectPlayer={(p, cardIndex) => {
                  const self = p.id === player.id;

                  onSelectArea({
                    id: self ? `game-${p.id}-${cardIndex}` : `game-${p.id}`,
                    type: self
                      ? ActionAreaType.SELF_PLAYER
                      : ActionAreaType.OTHER_PLAYER,
                    player: p,
                    cardIndex
                  });
                }}
                onNotifyPlayer={onNotifyPlayer}
              />
              <div className="pa2 flex flex-column flex-grow-1 h-100 overflow-scroll">
                <GameBoard
                  onRollback={onRollback}
                  onMenuClick={onMenuClick}
                  onLogsClick={onLogsClick}
                  onSelectDiscard={() =>
                    onSelectArea({
                      id: "discard",
                      type: ActionAreaType.DISCARD
                    })
                  }
                />
                <div className="bg-temple pa2 shadow-5 br2 mt3 flex-grow-1">
                  {game.status === "lobby" && (
                    <Lobby onJoinGame={onJoinGame} onStartGame={onStartGame} />
                  )}
                  {game.status === "ongoing" && (
                    <ActionArea
                      selectedArea={selectedArea}
                      onCommitAction={onCommitAction}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CurrentPlayerContext.Provider>
      </SelfPlayerContext.Provider>
    </GameContext.Provider>
  );
}
