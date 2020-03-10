import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
  View
} from "react-native";

import { LobbyView } from "../components/LobbyView";
import { Logs } from "../components/Logs";
import { PlayedCardsView } from "../components/PlayedCardsView";
import { PlayerView } from "../components/PlayerView";
import { ScoreView } from "../components/ScoreView";
import { TokenView } from "../components/TokenView";
import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";
import { Color, GameStatus, Player } from "../game/state";
import { Routes } from "../routes";
import { Colors } from "../styles/colors";
import { Column, Row } from "../ui/Layout";
import { Text, TextSize } from "../ui/Text";

export const PlayScreen: React.FC = () => {
  const navigation = useNavigation();
  const [exiting, setExiting] = useState(false);

  const route = useRoute();
  const { game, loadGame, autoPlay, selfPlayer, currentPlayer } = useGame();
  const { playerId } = usePlayer();
  const [selectedPlayer, setSeletedPlayer] = useState<Player>();

  const { gameId } = route.params;

  useEffect(() => {
    if (!gameId) {
      return;
    }

    loadGame(gameId);
  }, [gameId]);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      setExiting(true);
      return true;
    });

    return () => {
      handler.remove();
    };
  }, []);

  /**
   * Play for bots.
   */
  useEffect(() => {
    if (!game) return;
    if (game.status !== GameStatus.ONGOING) return;
    if (!selfPlayer || selfPlayer.index) return;
    if (!currentPlayer.bot) return;

    console.log("prefoo");
    const timeout = setTimeout(() => {
      console.log("foo");
      autoPlay();
    }, game.options.botsWait);

    return () => clearTimeout(timeout);
  }, [game && currentPlayer, game && game.status]);

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
      <Modal animationType="slide" transparent={true} visible={exiting}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1
          }}
        >
          <View style={{ padding: 20, backgroundColor: Colors.White }}>
            <Text
              size={TextSize.L}
              style={{ color: Colors.Blue.Dark, marginBottom: 20 }}
              value="You are about to exit the game"
            />
            <Row>
              <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => {
                  setExiting(false);
                }}
              >
                <Text
                  size={TextSize.L}
                  style={{ color: Colors.Blue.Dark }}
                  value="Cancel"
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.navigate(Routes.Home);
                  setExiting(false);
                }}
              >
                <Text
                  size={TextSize.L}
                  style={{ color: Colors.Blue.Dark }}
                  value="Exit"
                />
              </TouchableHighlight>
            </Row>
          </View>
        </View>
      </Modal>

      <Row>
        <ScoreView />
      </Row>

      <Row marginTop={4}>
        <Column flex={1}>
          <PlayedCardsView />
        </Column>

        <Column flex={1}>
          <View style={Styles.tokens}>
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
          </View>
        </Column>
      </Row>

      <Row marginTop={4} style={{ height: "10%" }}>
        <Logs />
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
      {selfPlayer && (
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
  player: {
    width: "100%"
  },
  tokens: {
    flexDirection: "row"
  },
  token: {
    marginHorizontal: 2
  }
});
