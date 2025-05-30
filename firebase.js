// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAvaK1TGjgAbrc7SBfMrG2zky30YUwuCAo",
    authDomain: "todolistfaculdade.firebaseapp.com",
    databaseURL: "https://todolistfaculdade-default-rtdb.firebaseio.com",
    projectId: "todolistfaculdade",
    storageBucket: "todolistfaculdade.appspot.com",
    messagingSenderId: "175229012112",
    appId: "1:175229012112:web:6c72575e92ae5ea1f9b015",
    measurementId: "G-1FVX028W1Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

