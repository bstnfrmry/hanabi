import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AsyncStorage,
  Image,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";

import { Routes } from "../routes";
import { Colors } from "../styles/colors";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [lastGameId, setLastGameId] = useState<string>();

  useEffect(() => {
    AsyncStorage.getItem("lastGameId").then(lastGameId => {
      setLastGameId(lastGameId);
    });
  }, []);

  const onCreateGamePress = () => {
    navigation.navigate(Routes.CreateGame);
  };

  const onPassAndPlayPress = () => {
    navigation.navigate(Routes.PassAndPlay);
  };

  const onJoinGamePress = () => {
    navigation.navigate(Routes.JoinGame);
  };

  const onJoinLastGamePress = () => {
    navigation.navigate(Routes.Play, { gameId: lastGameId });
  };

  return (
    <SafeAreaView style={style.screen}>
      <View style={style.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={style.logo}
        />
        <Text style={style.title} value={t("app:name")} />
        <Text style={style.subtitle} value={t("screens:home:tagline")} />
      </View>

      <View>
        <Button
          text={t("screens:home:buttons:createGame")}
          onPress={() => onCreateGamePress()}
        />

        <Button
          marginTop={4}
          text={t("screens:home:buttons:passAndPlay")}
          onPress={() => onPassAndPlayPress()}
        />

        <Button
          marginTop={4}
          text={t("screens:home:buttons:joinGame")}
          onPress={() => onJoinGamePress()}
        />

        {lastGameId && (
          <Button
            marginTop={4}
            text={t("screens:home:buttons:joinLastGame")}
            onPress={() => onJoinLastGamePress()}
          />
        )}
      </View>
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

  header: {
    alignItems: "center"
  },

  logo: {
    width: 128,
    height: 128
  },

  title: {
    color: Colors.White,
    fontSize: 64,
    marginTop: 32,
    textTransform: "uppercase"
  },

  subtitle: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.Gray.Medium
  },

  button: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 16,
    backgroundColor: Colors.White,
    borderRadius: 8,
    marginBottom: 24
  },

  buttonText: {
    fontSize: 32,
    textTransform: "uppercase"
  }
});
