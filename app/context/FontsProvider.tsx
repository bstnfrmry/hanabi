import * as Font from "expo-font";
import React, { useEffect, useState } from "react";

import { Text } from "../ui/Text";

export const FontsProvider: React.FC = props => {
  const { children } = props;

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "Kalam Regular": require("../../assets/fonts/Kalam-Regular.ttf"),
      "Kalam Bold": require("../../assets/fonts/Kalam-Bold.ttf")
    }).then(() => {
      setFontLoaded(true);
    });
  }, []);

  if (!fontLoaded) {
    return <Text value={"Loading fonts..."} />;
  }

  return <>{children}</>;
};
