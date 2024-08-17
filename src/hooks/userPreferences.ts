import React, { useContext } from "react";

export interface UserPreferences {
  soundOnStrike?: boolean;
  showFireworksAtGameEnd?: boolean;
  codedHintMarkers?: boolean;
}

type ValueAndSetter<T> = [T, (newValue: T) => void];

const DefaultPreferences: UserPreferences = {
  soundOnStrike: true,
  showFireworksAtGameEnd: true,
  codedHintMarkers: false,
};
export function loadUserPreferences(): UserPreferences {
  if (window) {
    const preferenceJson = window.localStorage.getItem("userPreferences");
    if (preferenceJson) {
      const loadedPreferences = JSON.parse(preferenceJson);
      return { ...DefaultPreferences, ...loadedPreferences };
    }
  }
  return DefaultPreferences;
}
export const UserPreferencesContext = React.createContext<ValueAndSetter<UserPreferences>>([
  DefaultPreferences,
  () => {
    console.warn("Unexpected attempt to change default User Preferences");
  },
]);

export function useUserPreferences(): ValueAndSetter<UserPreferences> {
  const [userPreferences, setUserPreferencesToContext] = useContext(UserPreferencesContext);

  return [
    userPreferences,
    (userPreferences: UserPreferences) => {
      setUserPreferencesToContext(userPreferences);
      if (window) {
        window.localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
      }
    },
  ];
}
