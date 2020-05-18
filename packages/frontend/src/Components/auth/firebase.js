import * as firebase from "firebase/app";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAKt1ZhBp31KUC--95aT9fZAUuu4t4AyfI",
  authDomain: "draycer-a84cb.firebaseapp.com",
  databaseURL: "https://draycer-a84cb.firebaseio.com",
  projectId: "draycer-a84cb",
  storageBucket: "draycer-a84cb.appspot.com",
  messagingSenderId: "558700456978",
  appId: "1:558700456978:web:f55145ca57aa4ae4727ccb",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase

export const auth = firebase.auth

