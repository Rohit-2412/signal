import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCDP8H-tDR7_jbRyyBR6usVUa3UUddKrPk",
    authDomain: "signal-494a7.firebaseapp.com",
    projectId: "signal-494a7",
    storageBucket: "signal-494a7.appspot.com",
    messagingSenderId: "87202819849",
    appId: "1:87202819849:web:05735184b06e5a2584edd8"
};

let app;

if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();
}

const db = app.firestore()
const auth = firebase.auth()

export { db, auth };