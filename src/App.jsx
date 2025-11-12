import React, { useEffect, useState } from 'react'
import UploadCard from './components/UploadCard'
import RefineActions from './components/RefineActions'
import AuthBar from './components/AuthBar'

function Header() {
  return (
    <header className="py-6">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">AI</div>
          <span className="font-semibold text-blue-900">Resume Refiner</span>
        </div>
        <AuthBar />
      </div>
    </header>
  )
}

export default function App() {
  const [step, setStep] = useState('upload')
  const [resume, setResume] = useState(null)

  useEffect(()=>{
    // assign referral if present
    const url = new URL(window.location.href)
    const ref = url.searchParams.get('ref')
    if (ref) localStorage.setItem('referrer', ref)
    // ensure uid
    if (!localStorage.getItem('uid')) localStorage.setItem('uid', `guest-${Math.random().toString(36).slice(2,8)}`)
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <section className="text-center py-8">
          <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Turn your resume into a recruiter-ready PDF</h1>
          <p className="text-gray-600 mt-3">Upload your resume, pick a role, and get an ATS-optimized version powered by AI. Preview free. Unlock full version for ₹49.</p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <UploadCard onUploaded={(data)=>{ setResume(data); setStep('refine') }} />
          <div className="space-y-4">
            {step === 'upload' && (
              <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900">How it works</h3>
                <ol className="mt-2 text-gray-600 text-sm space-y-1 list-decimal list-inside">
                  <li>Upload your resume (PDF/DOCX)</li>
                  <li>We rewrite it with quantified achievements and ATS keywords</li>
                  <li>Preview for free (30% visible)</li>
                  <li>Pay ₹49 to download the full refined PDF</li>
                </ol>
              </div>
            )}
            {step === 'refine' && resume && (
              <RefineActions resume={resume} onReadyToPay={()=> setStep('pay')} />
            )}
            {step === 'pay' && (
              <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900">Proceed to payment</h3>
                <p className="text-gray-600 text-sm">Click the button above to open Razorpay checkout. After payment, your download will start automatically.</p>
              </div>
            )}
          </div>
        </div>

        <section className="mt-10 bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">Referral rewards</h3>
          <p className="text-gray-600 text-sm">Share your link. For every 3 friends who try the app, you get 1 free download credit.</p>
          <div className="mt-3 flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2" value={`${window.location.origin}/?ref=${localStorage.getItem('uid') || ''}`} readOnly />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={()=>navigator.clipboard.writeText(`${window.location.origin}/?ref=${localStorage.getItem('uid') || ''}`)}>Copy</button>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} AI Resume Refiner</footer>
    </div>
  )
}
