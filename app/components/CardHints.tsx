import React from "react";
import { ImageBackground, StyleSheet, View, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { getColors } from "../game/actions";
import { Card, Color, HintLevel } from "../game/state";
import { ColorMap, Colors } from "../styles/colors";
import { Row, Square } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";

type Props = ViewProps & {
  card: Card;
};

export const CardHints: React.FC<Props> = props => {
  const { card, style } = props;

  const { game } = useGame();

  const colors = getColors(game);
  const numbers = [1, 2, 3, 4, 5];

  return (
    <View style={[Styles.hints, style]}>
      <Row>
        {colors.map(color => {
          const level = card.hint.color[color];
          const hintStyle = {
            [HintLevel.SURE]: Styles.sureHint,
            [HintLevel.IMPOSSIBLE]: Styles.impossibleHint,
            [HintLevel.POSSIBLE]: Styles.possibleHint
          }[level];

          return (
            <Square key={color} flex={1} margin={1}>
              <ImageBackground
                imageStyle={Styles.hintImage}
                source={ColorMap[color]}
                style={[Styles.hint, hintStyle]}
              />
            </Square>
          );
        })}
      </Row>
      <Row>
        {numbers.map(number => {
          const level = card.hint.number[number];
          const hintStyle = {
            [HintLevel.SURE]: Styles.sureHint,
            [HintLevel.IMPOSSIBLE]: Styles.impossibleHint,
            [HintLevel.POSSIBLE]: Styles.possibleHint
          }[level];

          return (
            <Square key={number} flex={1} margin={1}>
              <View style={[Styles.hint, hintStyle, Styles.numberHint]}>
                <Text
                  size={TextSize.S}
                  style={Styles.text}
                  value={`${number}`}
                />
              </View>
            </Square>
          );
        })}
      </Row>
    </View>
  );
};

const Styles = StyleSheet.create({
  hints: {
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  hint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: "100%",
    height: "100%",
    borderWidth: 1
  },
  hintImage: {
    borderRadius: 50
  },
  numberHint: {
    display: "flex"
  },
  sureHint: {
    borderWidth: 2,
    borderColor: Colors.White
  },
  possibleHint: {},
  impossibleHint: {
    opacity: 0.1
  }
});
