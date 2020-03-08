import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, ViewProps } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useGame } from "../context/GameContext";
import { getColors } from "../game/actions";
import { Color, HintType } from "../game/state";
import { ColorMap, Colors } from "../styles/colors";
import { Column, Row, Square } from "../ui/Layout";
import { Text } from "../ui/Text";

type Props = ViewProps & {
  onHintPress: (type: HintType, value: Color | Number) => void;
};

export const HintsView: React.FC<Props> = props => {
  const { onHintPress, style } = props;

  const { game } = useGame();

  const [selected, setSelected] = useState(null);

  const colors = getColors(game);
  const numbers = [1, 2, 3, 4, 5];

  const onColorHintPress = (color: Color) => {
    onHintPress("color", color);
    setSelected(color);
  };

  const onNumberHintPress = (number: Number) => {
    onHintPress("number", number);
    setSelected(number);
  };

  return (
    <Column style={[Styles.hints, style]}>
      <Row>
        {colors.map(color => {
          const isSelected = color === selected;

          return (
            <TouchableOpacity
              key={color}
              containerStyle={{ flex: 1 }}
              onPress={() => onColorHintPress(color)}
            >
              <Square>
                <ImageBackground
                  imageStyle={Styles.hintImage}
                  source={ColorMap[color]}
                  style={[Styles.hint, isSelected && Styles.selectedHint]}
                />
              </Square>
            </TouchableOpacity>
          );
        })}
      </Row>
      <Row>
        {numbers.map(number => {
          const isSelected = number === selected;

          return (
            <TouchableOpacity
              key={number}
              containerStyle={{ flex: 1 }}
              onPress={() => onNumberHintPress(number)}
            >
              <Square>
                <View style={[Styles.hint, isSelected && Styles.selectedHint]}>
                  <Text
                    adjustsFontSizeToFit
                    style={Styles.hintText}
                    value={`${number}`}
                  />
                </View>
              </Square>
            </TouchableOpacity>
          );
        })}
      </Row>
    </Column>
  );
};

const Styles = StyleSheet.create({
  hints: {},
  hint: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.White,
    flex: 1,
    margin: 1,
    backgroundColor: Colors.White
  },
  hintImage: {
    width: "100%",
    borderRadius: 50
  },
  hintText: {
    color: Colors.Blue.Dark,
    fontSize: 30
  },
  selectedHint: {
    borderWidth: 3
  }
});
