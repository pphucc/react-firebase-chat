import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-3f884.firebaseapp.com",
  projectId: "reactchat-3f884",
  storageBucket: "reactchat-3f884.appspot.com",
  messagingSenderId: "671008269521",
  appId: "1:671008269521:web:83d4e965b0261977ec11f0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
