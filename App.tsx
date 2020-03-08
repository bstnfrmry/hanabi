import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Suspense } from "react";
import { View } from "react-native";

import { FontsProvider } from "./app/context/FontsProvider";
import { GameProvider } from "./app/context/GameContext";
import { I18nProvider } from "./app/context/I18nContext";
import { NetworkProvider } from "./app/context/NetworkContext";
import { PlayerProvider } from "./app/context/PlayerContext";
import { Routes } from "./app/routes";
import { CreateGameScreen } from "./app/screens/CreateGameScreen";
import { HomeScreen } from "./app/screens/HomeScreen";
import { JoinGameScreen } from "./app/screens/JoinGameScreen";
import { PlayScreen } from "./app/screens/PlayScreen";
import { Text } from "./app/ui/Text";

const Stack = createStackNavigator();

const App: React.FC = () => {
  const fallback = (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text value="Suspense" />
    </View>
  );

  return (
    <Suspense fallback={fallback}>
      <I18nProvider>
        <FontsProvider>
          <NetworkProvider>
            <PlayerProvider>
              <GameProvider>
                <NavigationContainer>
                  <Stack.Navigator headerMode="none">
                    <Stack.Screen component={HomeScreen} name={Routes.Home} />
                    <Stack.Screen
                      component={CreateGameScreen}
                      name={Routes.CreateGame}
                    />
                    <Stack.Screen
                      component={JoinGameScreen}
                      name={Routes.JoinGame}
                    />
                    <Stack.Screen component={PlayScreen} name={Routes.Play} />
                  </Stack.Navigator>
                </NavigationContainer>
              </GameProvider>
            </PlayerProvider>
          </NetworkProvider>
        </FontsProvider>
      </I18nProvider>
    </Suspense>
  );
};

export default App;
