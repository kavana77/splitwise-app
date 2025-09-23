// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_7yH89peMWuxBwK1j8pJjfgBPaEaZq_c",
  authDomain: "splitwise-authentication.firebaseapp.com",
  projectId: "splitwise-authentication",
  storageBucket: "splitwise-authentication.firebasestorage.app",
  messagingSenderId: "709964877048",
  appId: "1:709964877048:web:443ab1b03958ede27d3f0d",
  databaseURL:'https://splitwise-authentication-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const db = getDatabase(app)
export {auth, googleProvider,db}