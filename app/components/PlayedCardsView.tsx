import { orderBy } from "lodash";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { getColors } from "../game/actions";
import { CardSize, CardView } from "./CardView";
import { CardWrapperView } from "./CardWrapperView";

type Props = ViewProps & {};

export const PlayedCardsView: React.FC<Props> = props => {
  const { style } = props;

  const { game } = useGame();

  const colors = getColors(game);
  const orderedCards = orderBy(game.playedCards, card => card.number, "desc");

  return (
    <View style={[Styles.container, style]}>
      {colors.map((color, i) => {
        const highestCard = orderedCards.find(card => card.color === color);

        if (!highestCard) {
          return (
            <CardWrapperView
              key={i}
              color={color}
              size={CardSize.M}
              style={Styles.card}
            />
          );
        } else {
          return (
            <CardView
              key={i}
              card={highestCard}
              size={CardSize.M}
              style={Styles.card}
            />
          );
        }
      })}
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    marginLeft: -1,
    flexDirection: "row"
  },
  card: {
    flex: 1,
    marginHorizontal: 1
  }
});
