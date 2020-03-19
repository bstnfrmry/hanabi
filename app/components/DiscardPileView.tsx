import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useGame } from "../context/GameContext";
import { Text } from "../ui/Text";
import { CardWrapperView } from "./CardWrapperView";

type Props = ViewProps & {
  onClick: Function;
};

export const DiscardPileView: React.FC<Props> = props => {
  const { style, onClick } = props;
  const { game } = useGame();

  return (
    <TouchableOpacity onPress={() => onClick()}>
      <CardWrapperView color={null} size={40} style={style}>
        <Text value={`${game.discardPile.length}`} />
      </CardWrapperView>
    </TouchableOpacity>
  );
};

const Styles = StyleSheet.create({});
