import Constants from "expo-constants";
import type { FirebaseOptions } from "firebase/app";
import { getApps, initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Force configuration to be true by providing the fallback directly
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBN2CcpjrCPm0dy300UT3SOnr-y1iazv4Y",
  authDomain: "cookflow-8b674.firebaseapp.com",
  projectId: "cookflow-8b674",
  storageBucket: "cookflow-8b674.firebasestorage.app",
  messagingSenderId: "82299497132",
  appId: "1:82299497132:web:6efdf48bd38b5dec758d09",
};

// We explicitly set this to true since we have the hardcoded config above
const isFirebaseConfigured = true;

console.log("Firebase initialized with project:", firebaseConfig.projectId);

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let auth = null;
if (app) {
  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    // For native platforms, we need to import getReactNativePersistence dynamically or use a conditional approach
    // Since we are in a shared file, we can try to use a safer initialization
    try {
      const { getReactNativePersistence } = require("firebase/auth");
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (e) {
      auth = getAuth(app);
    }
  }
}

const db = getFirestore(app);

export { auth, db, isFirebaseConfigured };
