// Pedacito de Firebase que usa Cuentas Claras: sesión con Google y la base de datos (versión liviana).
// El login con Google lo hace la app sola (ver «nubeEntrar» en index.html) y acá solo se le pasa el resultado.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, runTransaction, deleteDoc, Bytes, serverTimestamp } from 'firebase/firestore/lite';
export { initializeApp, getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut, getFirestore, doc, getDoc, runTransaction, deleteDoc, Bytes, serverTimestamp };
