import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Web app's Firebase configuración
const firebaseConfig = {
  apiKey: "AIzaSyCmn30eTS2p6p6RNE_vOKLGVON6Ko9hy4s",
  authDomain: "ejercicio-3-49a31.firebaseapp.com",
  projectId: "ejercicio-3-49a31",
  storageBucket: "ejercicio-3-49a31.firebasestorage.app",
  messagingSenderId: "25017708802",
  appId: "1:25017708802:web:f0f79216b361cad036121b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Auth
const auth = getAuth(app);

// Inicializar Storage
const storage = getStorage(app);

// Exportar las instancias para usarlas en otros archivos
export { db, auth, storage };
