import React, { useState } from 'react'

export default function UploadCard({ onUploaded }) {
  const [role, setRole] = useState('Data Analyst')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append('uid', localStorage.getItem('uid') || 'anon')
    form.append('target_role', role)
    form.append('file', file)
    const res = await fetch(`${backend}/api/upload`, { method: 'POST', body: form })
    const data = await res.json()
    setLoading(false)
    if (data.resume_id) onUploaded({ ...data, target_role: role })
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
      <h3 className="text-xl font-semibold text-blue-900">Upload your resume</h3>
      <p className="text-sm text-gray-500 mb-4">PDF or DOCX. We'll refine it for your target role.</p>
      <form onSubmit={handleUpload} className="space-y-3">
        <input type="text" value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Target role e.g. Frontend Developer" className="w-full border rounded-lg px-3 py-2" />
        <input type="file" accept=".pdf,.docx" onChange={(e)=>setFile(e.target.files[0])} className="w-full" />
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}
