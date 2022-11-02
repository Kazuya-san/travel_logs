// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtuXayhopo88McBjLFLMFzGhu2E1Ck0z8",
  authDomain: "dictoapp-e7626.firebaseapp.com",
  projectId: "dictoapp-e7626",
  storageBucket: "dictoapp-e7626.appspot.com",
  messagingSenderId: "965593020432",
  appId: "1:965593020432:web:562ed519490740b6d7b295",
  measurementId: "G-7SYM6G2ZSD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
