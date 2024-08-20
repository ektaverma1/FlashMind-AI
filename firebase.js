// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIhJCQGAk8D-bJzZ4cKzD0s8o_LNAiMPw",
  authDomain: "flashcard-saas-cc12a.firebaseapp.com",
  projectId: "flashcard-saas-cc12a",
  storageBucket: "flashcard-saas-cc12a.appspot.com",
  messagingSenderId: "1070481850372",
  appId: "1:1070481850372:web:75822ae10c6a13fc7a3551",
  measurementId: "G-GEME61489R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export  { db };