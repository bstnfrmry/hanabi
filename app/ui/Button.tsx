import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  View
} from "react-native";

import { Colors } from "../styles/colors";
import { LayoutProps } from "./Layout";
import { Text } from "./Text";

type Props = TouchableHighlightProps &
  LayoutProps & {
    variant?: ButtonVariant;
    active?: boolean;
    disabled?: boolean;
    text: string;

    onPress: () => void;
  };

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Void = "void"
}

export const Button: React.FC<Props> = props => {
  const {
    active = false,
    disabled = false,
    text,
    onPress,
    style,
    ...rest
  } = props;
  const styles = makeStyles(props);

  return (
    <TouchableHighlight disabled={disabled} style={style} onPress={onPress}>
      <View {...rest} style={[styles.button, active && styles.selectedButton]}>
        <Text style={styles.buttonText} value={text} />
      </View>
    </TouchableHighlight>
  );
};

const makeStyles = (props: Props) => {
  const { variant = ButtonVariant.Primary, disabled = false } = props;

  return StyleSheet.create({
    button: {
      ...(variant === ButtonVariant.Primary && {
        width: 200,
        height: 50,
        borderColor: Colors.Blue.Medium,
        borderWidth: 1,
        backgroundColor: Colors.White
      }),
      ...(variant === ButtonVariant.Void && {
        paddingVertical: 2,
        paddingHorizontal: 4
      }),
      ...(disabled && {
        opacity: 0.5
      }),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8
    },

    selectedButton: {
      borderWidth: 4,
      borderColor: Colors.Yellow.Medium
    },

    buttonText: {
      color: Colors.Blue.Medium,
      fontSize: 20,
      ...(variant === ButtonVariant.Void && {
        color: Colors.White
      })
    }
  });
};
