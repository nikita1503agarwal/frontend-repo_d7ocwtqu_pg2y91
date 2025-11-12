import React, { useEffect, useState } from 'react'

export default function Checkout({ resume }) {
  const backend = import.meta.env.VITE_BACKEND_URL
  const [order, setOrder] = useState(null)

  useEffect(()=>{
    const load = async () => {
      const form = new FormData()
      form.append('uid', localStorage.getItem('uid') || 'anon')
      form.append('resume_id', resume.resume_id)
      const res = await fetch(`${backend}/api/razorpay/order`, { method: 'POST', body: form })
      const data = await res.json()
      setOrder(data)
      if (data?.key_id && data?.order?.id) openRazorpay(data.key_id, data.order)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const openRazorpay = (key, rOrder) => {
    if (!window.Razorpay) {
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = () => openRazorpay(key, rOrder)
      document.body.appendChild(s)
      return
    }
    const uid = localStorage.getItem('uid') || 'anon'
    const options = {
      key,
      amount: rOrder.amount,
      currency: rOrder.currency,
      name: 'AI Resume Refiner',
      description: 'Unlock full refined resume',
      order_id: rOrder.id,
      handler: async function (response) {
        const verify = await fetch(`${backend}/api/razorpay/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, order_id: rOrder.id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
        })
        const v = await verify.json()
        if (v.status === 'verified') {
          window.location.href = `/download?resume_id=${resume.resume_id}`
        }
      },
      prefill: { name: 'Guest User', email: 'guest@example.com' },
      theme: { color: '#2563eb' }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
      <h3 className="text-xl font-semibold text-blue-900">Processing payment</h3>
      <p className="text-sm text-gray-500">Please wait, opening checkout...</p>
    </div>
  )
}
