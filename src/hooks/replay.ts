import React, { useContext } from "react";

interface ReplayProps {
  cursor: number;
  moveCursor: (to: number) => void;
}

export const ReplayContext = React.createContext<ReplayProps>(null);

export function useReplay() {
  return useContext<ReplayProps>(ReplayContext);
}
