import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAp_Bge6jm0AVX6Un2vIXQZpjLoc_mTmgQ",
  authDomain: "digislidesapp.firebaseapp.com",
  databaseURL: "https://digislidesapp-default-rtdb.firebaseio.com",
  projectId: "digislidesapp",
  storageBucket: "digislidesapp.appspot.com",
  messagingSenderId: "251415751533",
  appId: "1:251415751533:android:1b183864f4e666e0a54864"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbStore = getFirestore(app)

export { app, database, dbStore };
