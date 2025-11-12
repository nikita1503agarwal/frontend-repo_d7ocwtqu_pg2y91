import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app, auth, db

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  return { app, auth, db }
}

export async function googleSignIn() {
  const { auth } = initFirebase()
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user
  localStorage.setItem('uid', user.uid)
  localStorage.setItem('email', user.email || '')
  localStorage.setItem('name', user.displayName || '')
  return user
}

export async function doSignOut() {
  const { auth } = initFirebase()
  await signOut(auth)
  localStorage.removeItem('uid')
  localStorage.removeItem('email')
  localStorage.removeItem('name')
}

export async function logToFirebase(type, meta = {}) {
  try {
    const { db } = initFirebase()
    const uid = localStorage.getItem('uid') || 'anon'
    await addDoc(collection(db, 'logs'), {
      uid,
      type,
      meta,
      created_at: serverTimestamp(),
    })
  } catch (e) {
    // ignore logging errors
    console.warn('Firebase log failed', e)
  }
}
