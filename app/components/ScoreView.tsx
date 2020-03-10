import React from "react";
import { ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import {
  getMaximumPossibleScore,
  getMaximumScore,
  getScore
} from "../game/actions";
import { Colors } from "../styles/colors";
import { Row } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";

type Props = ViewProps & {};

export const ScoreView: React.FC<Props> = props => {
  const { game } = useGame();

  const score = getScore(game);
  const maxScore = getMaximumScore(game);
  const maxPossibleScore = getMaximumPossibleScore(game);

  return (
    <Row>
      <Text
        size={TextSize.L}
        value={`Score: ${score} / ${maxPossibleScore} `}
      />
      {maxPossibleScore !== maxScore && (
        <Text
          size={TextSize.L}
          style={{
            textDecorationLine: "line-through",
            color: Colors.Gray.Medium
          }}
          value={`${maxScore}`}
        />
      )}
    </Row>
  );
};
