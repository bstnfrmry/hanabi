import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";

import { Routes } from "../routes";
import { Colors } from "../styles/colors";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

export const JoinGameScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [gameId, setGameId] = useState("1234569");

  const onChangeGameId = (gameId: string) => {
    setGameId(gameId);
  };

  const onJoinGame = () => {
    navigation.navigate(Routes.Play, { gameId });
  };

  return (
    <SafeAreaView style={style.screen}>
      <Text style={style.title} value={t("screens:joinGame:title")} />

      <TextInput
        style={{ width: 100, height: 100, backgroundColor: Colors.White }}
        value={gameId}
        onChangeText={gameId => onChangeGameId(gameId)}
      />

      <Button
        disabled={!gameId}
        text={t("screens:play:joinGame")}
        onPress={() => onJoinGame()}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.Blue.Dark
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.Gray.Medium
  },

  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  }
});
