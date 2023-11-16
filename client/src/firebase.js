// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "barbill.firebaseapp.com",
  projectId: "barbill",
  storageBucket: "barbill.appspot.com",
  messagingSenderId: "915239787588",
  appId: "1:915239787588:web:78761cef8816fb52e8f011"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);