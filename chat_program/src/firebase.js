// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
	getAuth, 
	createUserWithEmailAndPassword, 
	updateProfile,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut
} from 'firebase/auth';
import { getDatabase,
	ref,
	set,
	child,
	update,
	push,
	onChildAdded,
	serverTimestamp,
	onValue,
	remove,
	get,
	onChildRemoved
} from 'firebase/database';
import { 
	getStorage,
	ref as strRef, 
	uploadBytes, 
	getDownloadURL, 
	uploadBytesResumable 
} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDfn8lImFhZC8WusBgz43bEKUerTd4U7AQ",
	authDomain: "react-firebase-chat-app-900c9.firebaseapp.com",
	projectId: "react-firebase-chat-app-900c9",
	storageBucket: "react-firebase-chat-app-900c9.appspot.com",
	messagingSenderId: "1031193599911",
	appId: "1:1031193599911:web:4d4581c4f8fdf40b5d2082",
	measurementId: "G-2EXN4HWZ6Y"
};

// Initialize Firebase
initializeApp(firebaseConfig);


const firebase = { 
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
	getDatabase,
	ref,
	set,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	getStorage,
	strRef,
	uploadBytes,
	getDownloadURL,
	child,
	update,
	push,
	onChildAdded,
	serverTimestamp,
	uploadBytesResumable,
	onValue,
	remove,
	get,
	onChildRemoved
}
export default firebase;