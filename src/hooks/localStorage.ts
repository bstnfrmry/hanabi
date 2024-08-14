import { isString } from "lodash";
import { useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // No-op hook for SSR.
  if (typeof window === "undefined") {
    return [
      initialValue,
      () => {
        /* No op */
      },
    ];
  }

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item && initialValue !== null) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }

      try {
        return item ? JSON.parse(item) : initialValue;
      } catch (err) {
        // Some legacy items are stored as raw strings instead of JSON strings.
        // Restore it as a JSON string and return it.
        if (isString(item)) {
          window.localStorage.setItem(key, JSON.stringify(item));
          return item;
        }
      }
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
