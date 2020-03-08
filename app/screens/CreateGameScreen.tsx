import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { useGame } from "../context/GameContext";
import { Routes } from "../routes";
import { Colors } from "../styles/colors";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

export const CreateGameScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { createGame, PlayersCounts } = useGame();

  const [playersCount, setPlayersCount] = useState(PlayersCounts[0]);
  const [multicolor, setMulticolor] = useState(false);

  const onPlayersCountChange = (value: number) => {
    setPlayersCount(value);
  };

  const onMulticolorPress = () => {
    setMulticolor(!multicolor);
  };

  const onCreateGamePress = () => {
    const gameId = createGame(playersCount, multicolor);

    navigation.navigate(Routes.Play, {
      gameId
    });
  };

  return (
    <SafeAreaView style={style.screen}>
      <Text style={style.title} value={t("screens:createGame:title")} />

      <View style={style.buttons}>
        {PlayersCounts.map(count => {
          return (
            <Button
              key={count}
              active={playersCount === count}
              text={t("screens:createGame:playersCount", { count })}
              onPress={() => onPlayersCountChange(count)}
            />
          );
        })}
      </View>

      <Button
        active={multicolor}
        text={t("screens:createGame:multicolor")}
        onPress={onMulticolorPress}
      />

      <Button
        text={t("screens:createGame:createGame")}
        onPress={onCreateGamePress}
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
