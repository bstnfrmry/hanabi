import React from "react";
import {
  StyleSheet,
  Text as BaseText,
  TextProps as BaseTextProps
} from "react-native";

import { Colors } from "../styles/colors";

type TextProps = BaseTextProps & {
  size?: TextSize;
  outlined?: boolean;
  value: string;
};

export enum TextSize {
  S = 10,
  M = 14,
  L = 18,
  XL = 24
}

export const Text: React.FC<TextProps> = props => {
  const { value, outlined = false, size = TextSize.M, ...rest } = props;

  return (
    <BaseText
      {...rest}
      style={[
        Styles.text,
        { fontSize: size },
        outlined && Styles.outlined,
        props.style
      ]}
    >
      {value}
    </BaseText>
  );
};

const Styles = StyleSheet.create({
  text: {
    color: Colors.White,
    fontFamily: "Kalam Regular"
  },
  outlined: {
    textShadowOffset: { width: 0, height: 1 },
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowRadius: 1
  }
});
