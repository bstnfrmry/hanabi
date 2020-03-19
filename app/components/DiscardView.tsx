import React from "react";
import { StyleSheet, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { Text } from "../ui/Text";
import { CardWrapperView } from "./CardWrapperView";

type Props = ViewProps;

export const DiscardView: React.FC<Props> = props => {
  const { style } = props;
  const { game } = useGame();
  return (
    <CardWrapperView color={null} size={40} style={style}>
      <Text value={`${game.discardPile.length}`} />
    </CardWrapperView>
  );
};

const Styles = StyleSheet.create({});
