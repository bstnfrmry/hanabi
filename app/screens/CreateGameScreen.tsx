import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export const CreateGameScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Creating game</Text>
    </View>
  );
};
