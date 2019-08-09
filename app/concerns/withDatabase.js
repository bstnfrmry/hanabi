import firebase from "firebase/app";
import "firebase/database";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDeWR7W7kmxe4K7jGx7hqe92zJ4w5xl_DY",
  authDomain: "hanabi-df790.firebaseapp.com",
  databaseURL: "https://hanabi-df790.firebaseio.com",
  projectId: "hanabi-df790",
  storageBucket: "",
  messagingSenderId: "681034034410",
  appId: "1:681034034410:web:dff20eb4bcb7274d"
};

/**
 * Initialise Firebase when needed and inject it in our components as "db"
 */
export default Component => {
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

  const db = firebase.database();

  return props => <Component {...props} db={db} />;
};
