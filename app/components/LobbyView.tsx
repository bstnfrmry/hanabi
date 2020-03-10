import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

export const LobbyView: React.FC = () => {
  const { t } = useTranslation();
  const {
    game,
    selfPlayer,
    startGame,
    joinGame,
    addBot,
    isGameFull
  } = useGame();
  const { playerName, updateName } = usePlayer();

  const [name, setName] = useState(playerName);

  const onChangeName = (name: string) => {
    setName(name);
  };

  const onJoinGamePress = async () => {
    await updateName(name);
    joinGame();
  };

  const onBotAddPress = async () => {
    addBot();
  };

  const onStartGamePress = () => {
    startGame();
  };

  return (
    <View>
      {game.players.map(player => {
        return <Text key={player.id} value={player.name} />;
      })}

      <View>
        <Text value={`Share this code : ${game.id}`} />
      </View>

      {!selfPlayer && (
        <View>
          <TextInput value={name} onChangeText={name => onChangeName(name)} />

          <Button
            disabled={!name}
            text={t("screens:play:joinGame")}
            onPress={() => onJoinGamePress()}
          />
        </View>
      )}

      {selfPlayer && !isGameFull() && (
        <Button
          text={t("screens:play:addBot")}
          onPress={() => onBotAddPress()}
        />
      )}

      {isGameFull() && (
        <View>
          <Button
            disabled={!name}
            text={t("screens:play:startGame")}
            onPress={() => onStartGamePress()}
          />
        </View>
      )}
    </View>
  );
};
