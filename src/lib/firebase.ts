import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB5zORippEWFxyC6v54LgOByiC7rDK5Pec",
  authDomain: "celen-c2276.firebaseapp.com",
  databaseURL: "https://celen-c2276-default-rtdb.firebaseio.com",
  projectId: "celen-c2276",
  storageBucket: "celen-c2276.firebasestorage.app",
  messagingSenderId: "726352127154",
  appId: "1:726352127154:web:f2e8f1847207c67f3a95ab",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue, set, update, remove };
