import React, { useEffect, useState } from 'react'
import { initFirebase, googleSignIn, doSignOut } from '../lib/firebase'

export default function AuthBar() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    initFirebase()
    const uid = localStorage.getItem('uid')
    if (uid && uid.startsWith('guest-')) setUser(null)
    else if (uid) setUser({ uid, name: localStorage.getItem('name') })
  },[])

  const signIn = async () => {
    try {
      const u = await googleSignIn()
      setUser({ uid: u.uid, name: u.displayName })
    } catch (e) {
      alert('Sign-in failed')
    }
  }

  const signOut = async () => {
    await doSignOut()
    setUser(null)
  }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <span className="text-sm text-gray-600">Hi, {user.name?.split(' ')[0] || 'User'}</span>
          <button onClick={signOut} className="text-sm text-gray-500 underline">Sign out</button>
        </>
      ) : (
        <button onClick={signIn} className="px-3 py-1.5 bg-white border rounded-lg text-sm">Sign in</button>
      )}
    </div>
  )
}
