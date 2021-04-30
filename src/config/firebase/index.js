import firebase from 'firebase'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAFC_ivstIhE-sWefBBV5pcwXD5nnNrWqM",
    authDomain: "finalmobpro.firebaseapp.com",
    projectId: "finalmobpro",
    storageBucket: "finalmobpro.appspot.com",
    messagingSenderId: "593690153999",
    appId: "1:593690153999:web:382d5108bf9ba818837f7a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase