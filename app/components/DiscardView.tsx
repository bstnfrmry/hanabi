import { chunk, orderBy } from "lodash";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { useGame } from "../context/GameContext";
import { getColors } from "../game/actions";
import { Row } from "../ui/Layout";
import { CardSize, CardView } from "./CardView";
import { CardWrapperView } from "./CardWrapperView";
import { DiscardPileView } from "./DiscardPileView";

type Props = ViewProps;

export const DiscardView: React.FC<Props> = props => {
  const { style } = props;
  const { game } = useGame();

  const rows = chunk(getColors(game), 2);
  const ordereredCards = orderBy(game.discardPile, card => card.number);

  return (
    <View>
      {rows.map((colors, j) => {
        return (
          <Row key={j}>
            {colors.map((color, i) => {
              const toBeDisplayedCards = ordereredCards.filter(card => {
                return card.color === color;
              });

              return (
                <Row key={color} flex={1}>
                  {toBeDisplayedCards.length === 0 && (
                    <CardWrapperView color={color} size={30} />
                  )}
                  {toBeDisplayedCards.length > 0 && (
                    <>
                      {toBeDisplayedCards.map((card, k) => {
                        return (
                          <CardView
                            key={card.id}
                            card={card}
                            size={30}
                            style={{ marginLeft: k === 0 ? 0 : -4 }}
                          />
                        );
                      })}
                    </>
                  )}
                </Row>
              );
            })}
          </Row>
        );
      })}
    </View>
  );
};
const Styles = StyleSheet.create({});
