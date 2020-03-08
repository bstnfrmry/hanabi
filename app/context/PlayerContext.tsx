import React, { useContext, useEffect, useState } from "react";
import { AsyncStorage } from "react-native";

type PlayerContextProps = {
  playerId?: string;
  playerName?: string;

  updateName: (name: string) => Promise<void>;
};

const StorageKey = "player";

export const PlayerContext = React.createContext<PlayerContextProps>(null);

export const PlayerProvider: React.FC = props => {
  const { children } = props;

  const [playerId, setPlayerId] = useState<string>();
  const [playerName, setPlayerName] = useState<string>();

  const createPlayer = () => {
    const id = `${+new Date()}`;

    setPlayerId(id);

    AsyncStorage.setItem(
      StorageKey,
      JSON.stringify({
        playerId: id,
        name: ""
      })
    );
  };

  useEffect(() => {
    AsyncStorage.getItem(StorageKey).then(item => {
      if (!item) {
        createPlayer();
        return;
      }

      try {
        const json = JSON.parse(item);
        setPlayerId(json.playerId);
        setPlayerName(json.playerName);
      } catch (err) {
        console.error(`Could not parse player from async storage`, err);
        createPlayer();
      }
    });
  }, []);

  const context = {
    playerId,
    playerName,

    updateName: async (name: string) => {
      setPlayerName(name);

      await AsyncStorage.setItem(
        StorageKey,
        JSON.stringify({
          playerId,
          playerName: name
        })
      );
    }
  };

  return (
    <PlayerContext.Provider value={context}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};
