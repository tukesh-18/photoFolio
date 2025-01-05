

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkT6AXlFu-782995WS04ktO7jkUpFIP2U",
  authDomain: "photofolio-a0707.firebaseapp.com",
  projectId: "photofolio-a0707",
  storageBucket: "photofolio-a0707.firebasestorage.app",
  messagingSenderId: "995230689975",
  appId: "1:995230689975:web:8cc568936776e8324e3b32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);