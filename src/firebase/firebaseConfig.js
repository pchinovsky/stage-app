import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAJFVk-kdCGCvIEevWvws-BZ1u6YWL8BHM",
    authDomain: "stage-f9621.firebaseapp.com",
    projectId: "stage-f9621",
    storageBucket: "stage-f9621.firebasestorage.app",
    messagingSenderId: "165608388501",
    appId: "1:165608388501:web:6412b18a8c81a8a3fb289c",
    measurementId: "G-H87MW35ELC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 