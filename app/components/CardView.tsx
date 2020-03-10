import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Card } from "../game/state";
import { Colors } from "../styles/colors";
import { Row } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";
import { CardHints } from "./CardHints";
import { CardWrapperView } from "./CardWrapperView";

type Props = {
  card: Card;
  size: CardSize;
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const PositionMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E"
};

export enum CardSize {
  M,
  L
}

export const CardView: React.FC<Props> = props => {
  const { card, size = CardSize.M, visible = true, style } = props;

  const showHints = size === CardSize.L;

  return (
    <CardWrapperView color={card.color} size={size} style={style}>
      {visible && (
        <Row alignItems="center" flex={1} justifyContent="center">
          <Text
            outlined
            size={TextSize.XL}
            style={Styles.text}
            value={`${card.number}`}
          />
        </Row>
      )}
      {showHints && <CardHints card={card} style={Styles.hints} />}
    </CardWrapperView>
  );
};

const Styles = StyleSheet.create({
  hints: {
    marginTop: "auto",
    paddingBottom: "1%",
    width: "100%"
  }
});
