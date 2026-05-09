import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCPMBmbKP0X2-Q_QMW-VeBkaB2Y_kYCXxs",
    authDomain: "viagem-2026.firebaseapp.com",
    projectId: "viagem-2026",
    storageBucket: "viagem-2026.firebasestorage.app",
    messagingSenderId: "120884660168",
    appId: "1:120884660168:web:74b8c47ffc240217d822fd",
};

// Avoid reinitializing on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
});
