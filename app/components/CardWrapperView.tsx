import React from "react";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  ViewStyle
} from "react-native";

import { Color } from "../game/state";
import { ColorMap, Colors } from "../styles/colors";
import { Square } from "../ui/Layout";
import { CardSize } from "./CardView";

type Props = {
  color?: Color;
  size?: CardSize;
  style?: StyleProp<ViewStyle>;
};

export const CardWrapperView: React.FC<Props> = props => {
  const { color, children, style, size } = props;

  const source = color
    ? ColorMap[color]
    : require("../../assets/images/cards/gray.png");

  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <Square style={[Styles.wrapper, sizeStyle, style]}>
      <ImageBackground source={source} style={Styles.image}>
        {children}
      </ImageBackground>
    </Square>
  );
};

const Styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: Colors.White
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  }
});
