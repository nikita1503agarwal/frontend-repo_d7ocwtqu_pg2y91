import React, { useState } from 'react'
import PaywallPreview from './PaywallPreview'

export default function RefineActions({ resume, onReadyToPay }) {
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL

  const startRefine = async () => {
    setLoading(true)
    const res = await fetch(`${backend}/api/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: localStorage.getItem('uid') || 'anon', resume_id: resume.resume_id, target_role: resume.target_role })
    })
    const data = await res.json()
    setLoading(false)
    if (data.refined_preview) setPreview(data.refined_preview)
  }

  return (
    <div className="space-y-4">
      <button onClick={startRefine} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
        {loading ? 'Refining with AI...' : 'Refine Resume'}
      </button>
      {preview && (
        <>
          <PaywallPreview text={preview} />
          <button onClick={onReadyToPay} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg">Unlock full resume (₹49)</button>
        </>
      )}
    </div>
  )
}
