import * as firebase from "firebase/app";
import "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyATPMuXHan7SdBZZoMc7_MyBdJXcbF_sIk",
    authDomain: "react-login-536eb.firebaseapp.com",
    databaseURL: "https://react-login-536eb.firebaseio.com",
    projectId: "react-login-536eb",
    storageBucket: "react-login-536eb.appspot.com",
    messagingSenderId: "976046792585",
    appId: "1:976046792585:web:8449cb58c4d76df7"
};
// Initialize Firebase

export default firebase.initializeApp(firebaseConfig);
