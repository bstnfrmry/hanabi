import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { Color } from "../game/state";
import { Text } from "../ui/Text";
import { CardWrapperView } from "./CardWrapperView";

type Props = ViewProps;

export const DrawPileView: React.FC<Props> = props => {
  const { style } = props;
  const { game } = useGame();
  return (
    <CardWrapperView color={Color.BLUE} size={40} style={style}>
      <Text value={`${game.drawPile.length}`} />
    </CardWrapperView>
  );
};

const Styles = StyleSheet.create({});
