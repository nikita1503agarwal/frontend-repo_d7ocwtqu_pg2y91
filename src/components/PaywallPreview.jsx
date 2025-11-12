import React from 'react'

export default function PaywallPreview({ text }) {
  const previewLen = Math.max(200, Math.floor(text.length * 0.3))
  const visible = text.slice(0, previewLen)
  const blurred = text.slice(previewLen)

  return (
    <div className="bg-white/70 rounded-xl p-6 border border-blue-100 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-700 mb-3">Preview (30%)</h3>
      <div className="whitespace-pre-wrap text-gray-800">
        <span>{visible}</span>
        <span className="blur-sm select-none">{blurred}</span>
      </div>
      <div className="mt-4 text-sm text-gray-500">Unlock full resume for ₹49</div>
    </div>
  )
}
