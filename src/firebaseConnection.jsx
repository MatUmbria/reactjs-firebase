import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeZV-s4e9xA4Hso5JuKOAxEX8IOav28Bw",
  authDomain: "curso-dc8a5.firebaseapp.com",
  projectId: "curso-dc8a5",
  storageBucket: "curso-dc8a5.firebasestorage.app",
  messagingSenderId: "385039155068",
  appId: "1:385039155068:web:f44a6f1dc33d2f05e8eef9",
  measurementId: "G-H95DG5R7BB"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };