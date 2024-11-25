import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC3kNV-h4VyzCyDUg_7vg99LIbXrCHtVsg",
    authDomain: "chat-app-90d98.firebaseapp.com",
    projectId: "chat-app-90d98",
    storageBucket: "chat-app-90d98.firebasestorage.app",
    messagingSenderId: "378124351266",
    appId: "1:378124351266:web:ce27c7303466d067f2d77b"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

