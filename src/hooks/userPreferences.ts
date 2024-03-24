import React, { useContext } from "react";

export interface UserPreferences {
  soundOnStrike?: boolean;
  showFireworksAtGameEnd?: boolean;
}

type ValueAndSetter<T> = [T, (newValue: T) => void];

const DefaultPreferences = {
  soundOnStrike: true,
  showFireworksAtGameEnd: true,
};
export function loadUserPreferences(): UserPreferences {
  const preferenceJson = window.localStorage.getItem("userPreferences");
  if (preferenceJson) {
    const loadedPreferences = JSON.parse(preferenceJson);
    return { ...DefaultPreferences, ...loadedPreferences };
  }
  return DefaultPreferences;
}
export const UserPreferencesContext = React.createContext<ValueAndSetter<UserPreferences>>(null);

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
