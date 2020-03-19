import React from "react";
import { ScrollView, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { GameStatus } from "../game/state";
import { Text } from "../ui/Text";

type Props = ViewProps & {};

export const Logs: React.FC<Props> = props => {
  const { style } = props;

  const { game } = useGame();

  const turns = [...game.turnsHistory].reverse();

  return (
    <ScrollView indicatorStyle="white" style={[style]}>
      {game.status === GameStatus.OVER && (
        <>
          <Text
            style={{ fontFamily: "Kalam Bold", lineHeight: 20 }}
            value={`The game is over!`}
          />
          <Text
            style={{ fontFamily: "Kalam Bold", lineHeight: 20 }}
            value={`Your score is ${game.playedCards.length} 🎉`}
          />
        </>
      )}

      {turns.map((turn, i) => {
        let sentence = game.players[turn.action.from].name;

        if (turn.action.action === "discard") {
          sentence += ` discarded ${turn.action.card.number} ${turn.action.card.color}`;
        } else if (turn.action.action === "play") {
          sentence += ` played ${turn.action.card.number} ${turn.action.card.color}`;
        } else if (turn.action.action === "hint") {
          const target = game.players[turn.action.to].name;
          sentence += ` hinted ${target} about ${turn.action.value}'s`;
        }

        return <Text key={i} value={sentence} />;
      })}
    </ScrollView>
  );
};
