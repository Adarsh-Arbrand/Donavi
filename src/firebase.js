import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMf85SfmmH0I22JcmVZz4q131hirI8ysI",
  authDomain: "donavi-ar.firebaseapp.com",
  projectId: "donavi-ar",
  storageBucket: "donavi-ar.firebasestorage.app",
  messagingSenderId: "45870115833",
  appId: "1:45870115833:web:03c78757f44c87a9802b28"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);