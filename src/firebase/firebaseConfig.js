// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAJFVk-kdCGCvIEevWvws-BZ1u6YWL8BHM",
//     authDomain: "stage-f9621.firebaseapp.com",
//     projectId: "stage-f9621",
//     storageBucket: "stage-f9621.firebasestorage.app",
//     messagingSenderId: "165608388501",
//     appId: "1:165608388501:web:6412b18a8c81a8a3fb289c",
//     measurementId: "G-H87MW35ELC"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

//

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJFVk-kdCGCvIEevWvws-BZ1u6YWL8BHM",
    authDomain: "stage-f9621.firebaseapp.com",
    projectId: "stage-f9621",
    storageBucket: "stage-f9621.firebasestorage.app",
    messagingSenderId: "165608388501",
    appId: "1:165608388501:web:6412b18a8c81a8a3fb289c",
    measurementId: "G-H87MW35ELC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics }; 