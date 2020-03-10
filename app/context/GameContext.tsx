import React, { useContext, useEffect, useState } from "react";
import { AsyncStorage } from "react-native";

import * as actions from "../game/actions";
import play from "../game/ai";
import GameState, {
  Action,
  GameHintsLevel,
  GameMode,
  GameStatus,
  Player
} from "../game/state";
import { useNetwork } from "./NetworkContext";
import { usePlayer } from "./PlayerContext";

type GameContextProps = {
  PlayersCounts: number[];

  game: GameState;
  selfPlayer?: Player;
  currentPlayer?: Player;

  loadGame: (gameId: string) => void;
  createGame: (playersCount: number, multicolor: boolean) => string;
  startGame: () => void;
  joinGame: () => string;
  addBot: () => string;
  play: (action: Action) => void;
  autoPlay: () => void;
  isGameFull: () => boolean;
};

export const GameContext = React.createContext<GameContextProps>(null);

export function useGame() {
  return useContext(GameContext);
}

export const GameProvider: React.FC = props => {
  const { children } = props;

  const network = useNetwork();
  const { playerId, playerName } = usePlayer();

  const [gameId, setGameId] = useState<string>();
  const [game, setGame] = useState<GameState>();

  useEffect(() => {
    if (!gameId) {
      return;
    }

    network.subscribeToGame(gameId, game => {
      console.log("Loaded game");
      setGame(game);
    });
  }, [gameId]);

  const updateGame = (attributes: Partial<GameState>) => {
    const newGame = {
      ...game,
      ...attributes
    };

    setGame({ ...newGame, synced: false });
    network.updateGame(newGame);
  };

  const context = {
    PlayersCounts: [2, 3, 4, 5],

    game,
    ...(game && {
      currentPlayer: game.players[game.currentPlayer],
      selfPlayer: game.players.find(p => p.id === playerId)
    }),

    isGameFull: () => {
      return game.players.length === game.options.playersCount;
    },

    loadGame: (gameId: string) => {
      setGameId(gameId);
      AsyncStorage.setItem("lastGameId", gameId);
    },

    createGame: (playersCount: number, multicolor: boolean) => {
      const game = actions.newGame({
        id: "1234569",
        playersCount,
        multicolor,
        allowRollback: true,
        preventLoss: false,
        seed: "1234",
        private: true,
        hintsLevel: GameHintsLevel.ALL,
        turnsHistory: true,
        botsWait: 300,
        gameMode: GameMode.NETWORK
      });

      updateGame(game);

      return game.id;
    },

    startGame: () => {
      updateGame({ status: GameStatus.ONGOING });
    },

    play: (action: Action) => {
      updateGame(actions.commitAction(game, action));
    },

    autoPlay: () => {
      updateGame(play(game));
    },

    joinGame: () => {
      updateGame(
        actions.joinGame(game, {
          id: playerId,
          name: playerName,
          bot: false
        })
      );

      return playerId;
    },

    addBot: () => {
      const botsIndex = game.players.filter(player => player.bot).length + 1;

      updateGame(
        actions.joinGame(game, {
          id: `${new Date()}`,
          name: `Bot #${botsIndex}`,
          bot: true
        })
      );

      return playerId;
    }
  };

  return (
    <GameContext.Provider value={context}>{children}</GameContext.Provider>
  );
};
