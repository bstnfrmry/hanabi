import React from "react";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";

import { Card, HintLevel } from "../game/state";
import { ColorMap, Colors } from "../styles/colors";
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

export enum CardSize {
  M,
  L
}

export const CardView: React.FC<Props> = props => {
  const { card, size = CardSize.M, visible = true, style } = props;

  const showHints = size === CardSize.L;
  const showCardNumber =
    visible || card.hint.number[card.number] === HintLevel.SURE;
  const showCardColorHint =
    !visible && card.hint.color[card.color] === HintLevel.SURE;

  return (
    <CardWrapperView
      color={visible ? card.color : null}
      size={size}
      style={style}
    >
      {showCardColorHint && (
        <View style={Styles.colorHint}>
          <ImageBackground
            imageStyle={{ borderRadius: 50 }}
            source={ColorMap[card.color]}
            style={Styles.colorHintImage}
          />
        </View>
      )}

      {showCardNumber && (
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
    position: "absolute",
    bottom: 0,
    marginTop: "auto",
    width: "100%"
  },
  colorHint: {
    position: "absolute",
    top: "15%",
    left: "15%",
    width: "70%",
    height: "70%",
    borderRadius: 50
  },
  colorHintImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  }
});
