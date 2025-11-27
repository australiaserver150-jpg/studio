// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace this with your own Firebase configuration
// For more information on how to get this, see:
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBJ38gN4pz1RZph4oA5CDMChO45rgO6dss",
  authDomain: "fftopup-b6155.firebaseapp.com",
  databaseURL: "https://fftopup-b6155-default-rtdb.firebaseio.com",
  projectId: "fftopup-b6155",
  storageBucket: "fftopup-b6155.firebasestorage.app",
  messagingSenderId: "928923877740",
  appId: "1:928923877740:web:b6cbc75a13993886ad7349"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
