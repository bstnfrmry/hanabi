import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";

export type LayoutProps = {
  margin?: number | string;
  marginBottom?: number | string;
  marginEnd?: number | string;
  marginHorizontal?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginStart?: number | string;
  marginTop?: number | string;
  marginVertical?: number | string;

  padding?: number | string;
  paddingBottom?: number | string;
  paddingEnd?: number | string;
  paddingHorizontal?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingStart?: number | string;
  paddingTop?: number | string;
  paddingVertical?: number | string;

  flex?: number;
  alignItems?: string;
  justifyContent?: string;
  alignSelf?: string;
};

type Props = ViewProps & LayoutProps;

export const Row: React.FC<Props> = props => {
  const { style, ...rest } = props;

  return <View {...rest} style={[Styles.row, style]} />;
};

export const Column: React.FC<Props> = props => {
  const { style, alignSelf, ...rest } = props;

  return <View {...rest} style={[Styles.column, { alignSelf }, style]} />;
};

export const Square: React.FC<Props> = props => {
  const { style, ...rest } = props;

  return <View {...rest} style={[Styles.square, style]} />;
};

const Styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginLeft: 1,
    width: "100%"
  },
  column: {
    flexDirection: "column"
  },
  square: {
    aspectRatio: 1
  }
});
