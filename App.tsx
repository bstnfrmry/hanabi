import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "./app/i18n";
import { Routes } from "./app/routes";
import { CreateGameScreen } from "./app/screens/CreateGameScreen";
import { HomeScreen } from "./app/screens/HomeScreen";

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "Kalam Regular": require("./assets/fonts/Kalam-Regular.ttf")
    }).then(() => {
      setFontLoaded(true);
    });
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen component={HomeScreen} name={Routes.Home} />
          <Stack.Screen component={CreateGameScreen} name={Routes.CreateGame} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default App;
