import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

import { Routes } from "../routes";
import { Colors } from "../styles/colors";
import { Text } from "../ui/Text";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onCreateGamePress = () => {
    navigation.navigate(Routes.CreateGame);
  };

  const onPassAndPlayPress = () => {
    navigation.navigate(Routes.PassAndPlay);
  };

  const onJoinGamePress = () => {
    navigation.navigate(Routes.JoinGame);
  };

  return (
    <SafeAreaView style={style.screen}>
      <View style={style.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={style.logo}
        />
        <Text style={style.title}>{t("app:name")}</Text>
        <Text style={style.subtitle}>{t("screens:home:tagline")}</Text>
      </View>

      <View>
        <TouchableHighlight onPress={onCreateGamePress}>
          <View style={style.button}>
            <Text style={style.buttonText}>
              {t("screens:home:buttons:createGame")}
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={onPassAndPlayPress}>
          <View style={style.button}>
            <Text style={style.buttonText}>
              {t("screens:home:buttons:passAndPlay")}
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={onJoinGamePress}>
          <View style={style.button}>
            <Text style={style.buttonText}>
              {t("screens:home:buttons:joinGame")}
            </Text>
          </View>
        </TouchableHighlight>
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
