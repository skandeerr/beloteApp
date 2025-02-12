// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue, push } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdMUdo1BcirZMzp3F2D4bghmq3P5X0ROA",
  authDomain: "belote-4beed.firebaseapp.com",
  projectId: "belote-4beed",
  storageBucket: "belote-4beed.firebasestorage.app",
  messagingSenderId: "948583177395",
  databaseURL: "https://belote-4beed-default-rtdb.firebaseio.com/",
  appId: "1:948583177395:web:b667006d5f16f7d8b2a4c6",
  measurementId: "G-18SCFFZE8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
export { db, ref, set, onValue, push };