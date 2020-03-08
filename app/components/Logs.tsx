import React from "react";
import { ScrollView, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { Text } from "../ui/Text";

type Props = ViewProps & {};

export const Logs: React.FC<Props> = props => {
  const { style } = props;

  const { game } = useGame();

  const turns = [...game.turnsHistory].reverse();

  return (
    <ScrollView indicatorStyle="white" style={[style]}>
      {turns.map((turn, i) => {
        let sentence = game.players[turn.action.from].name;

        if (turn.action.action === "discard") {
          sentence += ` discarded ${turn.card.color} / ${turn.card.number}`;
        } else if (turn.action.action === "play") {
          sentence += ` played ${turn.card.color} / ${turn.card.number}`;
        } else if (turn.action.action === "hint") {
          const target = game.players[turn.action.to].name;
          sentence += ` hinted ${target} about ${turn.action.value}'s`;
        }

        return <Text key={i} value={sentence} />;
      })}
    </ScrollView>
  );
};
