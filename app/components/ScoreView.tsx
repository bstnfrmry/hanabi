import React from "react";
import { View, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import {
  getMaximumPossibleScore,
  getMaximumScore,
  getScore
} from "../game/actions";
import { Text, TextSize } from "../ui/Text";

type Props = ViewProps & {};

export const ScoreView: React.FC<Props> = props => {
  const { game } = useGame();

  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <View>
      <Text
        size={TextSize.L}
        value={`Score: ${score} / ${maxPossibleScore} / ${maxScore}`}
      />
    </View>
  );
};
