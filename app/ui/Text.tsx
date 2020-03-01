import React from "react";

import { Text as ReactNativeText, TextProps, StyleSheet } from "react-native";

export const Text: React.FC<TextProps> = props => {
  return <ReactNativeText {...props} style={[props!.style, style.text]} />;
};

const style = StyleSheet.create({
  text: {
    fontFamily: "Kalam Regular"
  }
});
