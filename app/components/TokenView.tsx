import React from "react";
import { ImageBackground, StyleSheet, View, ViewProps } from "react-native";

import { Color } from "../game/state";
import { ColorMap, Colors } from "../styles/colors";
import { Square } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";

type Props = ViewProps & {
  amount: number;
  color: Color;
};

export const TokenView: React.FC<Props> = props => {
  const { amount, color, style } = props;

  return (
    <ImageBackground
      imageStyle={Styles.image}
      source={ColorMap[color]}
      style={[Styles.token, { backgroundColor: color }, style]}
    >
      <Text outlined size={TextSize.XL} value={`${amount}`} />
    </ImageBackground>
  );
};

const Styles = StyleSheet.create({
  token: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
    height: 40,
    width: 40
  },
  image: {
    borderRadius: 50
  }
});
