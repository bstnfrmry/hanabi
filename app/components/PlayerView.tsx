import React, { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";

import { useGame } from "../context/GameContext";
import { MaxHints } from "../game/actions";
import {
  Card,
  Color,
  GameStatus,
  HintAction,
  HintType,
  Number,
  Player
} from "../game/state";
import { Colors } from "../styles/colors";
import { Button, ButtonVariant } from "../ui/Button";
import { Column, Row } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";
import { CardSize, CardView, PositionMap } from "./CardView";
import { HintsView } from "./HintsView";

type Props = ViewProps & {
  player: Player;
  selected: boolean;
  onSelect: (player: Player) => void;
};

function isCardHintable(hint: HintAction, card: Card) {
  return hint.type === "color"
    ? card.color === hint.value
    : card.number === hint.value;
}

function textualHint(hint: HintAction, cards: Card[]) {
  const hintableCards = cards
    .map((c, i) => (isCardHintable(hint, c) ? i : null))
    .filter(i => i !== null)
    .map(i => PositionMap[i]);

  if (hintableCards.length === 0) {
    if (hint.type === "color") return `You have no ${hint.value} cards.`;
    else return `You have no ${hint.value}s.`;
  }

  if (hintableCards.length === 1) {
    if (hint.type === "color")
      return `Your card ${hintableCards[0]} is ${hint.value}`;
    else return `Your card ${hintableCards[0]} is a ${hint.value}`;
  }

  if (hint.type === "color")
    return `Your cards ${hintableCards.join(", ")} are ${hint.value}`;

  return `Your cards ${hintableCards.join(", ")} are ${hint.value}s`;
}

export const PlayerView: React.FC<Props> = props => {
  const { player, selected, onSelect, style } = props;

  const { game, currentPlayer, selfPlayer, play } = useGame();

  const [hint, setHint] = useState();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const size = selected ? CardSize.L : CardSize.M;
  const isTurn = player === currentPlayer;
  const isSelfPlayerTurn = selfPlayer === currentPlayer;
  const isSelfPlayer = player === selfPlayer;
  const areCardsVisible = !isSelfPlayer;
  const canDiscard = game.tokens.hints < MaxHints;
  const hasSelectedCard = selectedCards.length;
  const isOngoing = game.status === GameStatus.ONGOING;
  const canPlay = selected && isSelfPlayerTurn && isOngoing;

  const onSelectPlayer = () => {
    onSelect(player);
  };

  const onUnselectPlayer = () => {
    onSelect(null);
    setSelectedCards([]);
  };

  const onSelectCard = (card: Card) => {
    if (!selected) {
      onSelect(player);
    }

    if (isSelfPlayer) {
      setSelectedCards([card]);
    } else {
    }
  };

  const onHintPress = (type: HintType, value: Color | Number) => {
    setHint({ type, value });
    setSelectedCards(
      player.hand.filter(card => {
        if (type === "color") {
          return card.color === value;
        }
        if (type === "number") {
          return card.number === value;
        }
      })
    );
  };

  const onHintGivePress = () => {
    play({
      action: "hint",
      from: currentPlayer.index,
      to: player.index,
      type: hint.type,
      value: hint.value
    });
  };

  const onDiscardPress = () => {
    const [card] = selectedCards;
    const cardIndex = player.hand.indexOf(card);

    play({
      action: "discard",
      from: currentPlayer.index,
      card,
      cardIndex
    });
  };

  const onPlayPress = () => {
    const [card] = selectedCards;
    const cardIndex = player.hand.indexOf(card);

    play({
      action: "play",
      from: currentPlayer.index,
      card,
      cardIndex
    });
  };

  const Container = selected ? Column : Row;

  return (
    <View style={style}>
      <Container>
        <View style={Styles.playerName}>
          <Row>
            <Column>
              {isSelfPlayer && isSelfPlayerTurn && (
                <Text
                  size={TextSize.M}
                  style={Styles.currentTurn}
                  value={"Your turn"}
                />
              )}
              <Row>
                {isTurn && (
                  <Text
                    size={TextSize.L}
                    style={[
                      Styles.currentTurn,
                      {
                        color: isSelfPlayerTurn
                          ? Colors.Yellow.Medium
                          : Colors.White
                      }
                    ]}
                    value={"➤ "}
                  />
                )}
                <Text size={TextSize.L} value={player.name} />
              </Row>
            </Column>

            {selected && (
              <Button
                style={Styles.unselectPlayerButton}
                text="×"
                variant={ButtonVariant.Void}
                onPress={() => onUnselectPlayer()}
              />
            )}
          </Row>
        </View>

        <TouchableWithoutFeedback
          containerStyle={!selected && { flex: 1 }}
          onPress={() => onSelectPlayer()}
        >
          <Row style={[Styles.hand]}>
            {player.hand.map(card => {
              const isSelected = selectedCards.indexOf(card) >= 0;

              return (
                <TouchableOpacity
                  key={card.id}
                  containerStyle={{ flex: 1 }}
                  onPress={() => onSelectCard(card)}
                >
                  <CardView
                    card={card}
                    size={size}
                    style={[Styles.card, isSelected && Styles.selectedCard]}
                    visible={areCardsVisible}
                  />
                </TouchableOpacity>
              );
            })}
          </Row>
        </TouchableWithoutFeedback>
      </Container>

      {canPlay && (
        <Column alignSelf="flex-end" marginTop={10}>
          {!isSelfPlayer && (
            <>
              <HintsView
                onHintPress={(type, value) => onHintPress(type, value)}
              />
              {hint && (
                <Text
                  style={Styles.hintText}
                  value={textualHint(hint, player.hand)}
                />
              )}
              <Button
                disabled={!hint}
                marginTop={10}
                text={`Hint`}
                onPress={() => onHintGivePress()}
              />
            </>
          )}

          {isSelfPlayer && (
            <Row>
              <Button
                disabled={!hasSelectedCard || !canDiscard}
                text={`Discard`}
                onPress={() => onDiscardPress()}
              />
              <Button
                disabled={!hasSelectedCard}
                marginLeft={10}
                text={`Play`}
                onPress={() => onPlayPress()}
              />
            </Row>
          )}
        </Column>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  playerName: {
    minWidth: "50%"
  },
  currentTurn: {
    marginRight: 2,
    color: Colors.Yellow.Medium
  },
  unselectPlayerButton: {
    marginLeft: "auto"
  },
  hand: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  card: {
    marginHorizontal: 2
  },
  selectedCard: {
    borderWidth: 3
  },
  hintText: { marginTop: -60 }, // TODO fix that horrible margin-top
  actions: {
    marginTop: 8,
    alignSelf: "flex-end"
  }
});
