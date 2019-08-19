import React, { useContext } from "react";

import firebase from "firebase/app";
import "firebase/database";

const DatabaseContext = React.createContext(null);

export const DatabaseProvider = DatabaseContext.Provider;

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function setupDatabase() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      // Local database configuration using firebase-server
      ...(process.env.FIREBASE_DATABASE_URL && {
        databaseURL: process.env.FIREBASE_DATABASE_URL
      }),
      // Online database configuration
      ...(process.env.FIREBASE_API_KEY && {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      })
    });
  }

  return firebase.database();
}
