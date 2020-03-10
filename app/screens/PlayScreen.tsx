import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { DiscardView } from "../components/DiscardView";
import { DrawPileView } from "../components/DrawPileView";
import { LobbyView } from "../components/LobbyView";
import { Logs } from "../components/Logs";
import { PlayedCardsView } from "../components/PlayedCardsView";
import { PlayerView } from "../components/PlayerView";
import { ScoreView } from "../components/ScoreView";
import { TokenView } from "../components/TokenView";
import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";
import { Color, GameStatus, Player } from "../game/state";
import { Colors } from "../styles/colors";
import { Column, Row } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";

export const PlayScreen: React.FC = () => {
  const route = useRoute();
  const { game, loadGame, selfPlayer } = useGame();
  const { playerId } = usePlayer();
  const [selectedPlayer, setSeletedPlayer] = useState<Player>();

  const { gameId } = route.params;

  useEffect(() => {
    if (!gameId) {
      return;
    }

    loadGame(gameId);
  }, [gameId]);

  const onSelectPlayer = (player: Player) => {
    setSeletedPlayer(player);
  };

  if (!game) {
    return <Text value={"Loading game..."} />;
  }

  const position = selfPlayer ? selfPlayer.index : game.players.length;
  const otherPlayers = [
    ...game.players.slice(position + 1),
    ...game.players.slice(0, position)
  ];

  return (
    <View style={Styles.screen}>
      <Row>
        <ScoreView />
      </Row>

      <Row marginTop={4} style={Styles.secondRow}>
        <Column flex={1}>
          <PlayedCardsView />
        </Column>

        <Column flex={1}>
          <Row style={Styles.tokens}>
            <TokenView
              amount={game.tokens.hints}
              color={Color.BLUE}
              style={Styles.token}
            />
            <TokenView
              amount={game.tokens.strikes}
              color={Color.RED}
              style={Styles.token}
            />
            <DrawPileView style={Styles.token} />
            <DiscardView style={Styles.token} />
          </Row>
        </Column>
      </Row>

      <Row marginTop={4} style={{ height: "20%" }}>
        <Column flex={2}>
          <Logs />
        </Column>
        <Column flex={1}>
          <Row>
            <Column>
              <Text size={TextSize.S} style={Styles.beurk} value="deck" />
              {game.drawPile.length < 6 && (
                <Text
                  size={TextSize.S}
                  style={Styles.beurk2}
                  value={`${game.drawPile.length} left`}
                />
              )}
            </Column>
            <Column>
              <Text size={TextSize.S} style={Styles.beurk} value="discard" />
            </Column>
          </Row>
        </Column>
      </Row>

      {otherPlayers.map(player => {
        const isSelected = player === selectedPlayer;

        return (
          <Row key={player.id} marginTop={20}>
            <PlayerView
              player={player}
              selected={isSelected}
              style={Styles.player}
              onSelect={player => onSelectPlayer(player)}
            />
          </Row>
        );
      })}

      {game.players.length > 0 && (
        <Row marginTop={20}>
          <PlayerView
            player={selfPlayer}
            selected={selfPlayer === selectedPlayer}
            style={Styles.player}
            onSelect={player => onSelectPlayer(player)}
          />
        </Row>
      )}

      {game.status === GameStatus.LOBBY && <LobbyView />}
    </View>
  );
};

const Styles = StyleSheet.create({
  screen: {
    paddingTop: StatusBar.currentHeight + 4,
    flex: 1,
    padding: 4,
    backgroundColor: Colors.Blue.Dark
  },
  secondRow: {
    justifyContent: "space-between" // TODO fix this that does not work
  },
  player: {
    width: "100%"
  },
  tokens: {
    flexDirection: "row"
  },
  token: {
    marginHorizontal: 2
  },
  beurk: {
    marginHorizontal: 10,
    textAlign: "center"
  },
  beurk2: {
    marginHorizontal: 5,
    color: Colors.Red.Medium
  }
});
