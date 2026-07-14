import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD7NdtVxlkhS8lkiFRvLIeOqCoWU_v1G5o",
    authDomain: "vyshuartsstudio.firebaseapp.com",
    projectId: "vyshuartsstudio",
    storageBucket: "vyshuartsstudio.firebasestorage.app",
    messagingSenderId: "365437526647",
    appId: "1:365437526647:web:9daa5c9d5be74568489c72",
    measurementId: "G-302MMGEPC2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);