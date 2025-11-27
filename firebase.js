import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./firebase.config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export { app, database };
