// Pedacito de Firebase que usa Cuentas Claras: login con Google y la base de datos (versión liviana).
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, runTransaction, deleteDoc, Bytes, serverTimestamp } from 'firebase/firestore/lite';
export { initializeApp, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, getFirestore, doc, getDoc, runTransaction, deleteDoc, Bytes, serverTimestamp };
