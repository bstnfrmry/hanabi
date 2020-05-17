import { useContext } from "react";
import React from "react";

export const SessionContext = React.createContext<Session>(null);

export interface Session {
  playerId: string;
}

export function useSession() {
  return useContext(SessionContext) || { playerId: null };
}
