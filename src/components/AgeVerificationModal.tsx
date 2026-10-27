'use client'
import { useState, useEffect } from 'react'

export default function AgeVerificationModal() {
  const [verified, setVerified] = useState(true)

  useEffect(() => {
    const isVerified = localStorage.getItem('age_verified')
    if (!isVerified) {
      setVerified(false)
    }
  }, [])

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true')
    setVerified(true)
  }

  if (verified) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center text-white shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-red-500">Contenido Exclusivo (+18)</h2>
        <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
          Este sitio web contiene material explícito destinado exclusivamente a adultos mayores de 18 años. Debes confirmar tu mayoría de edad para continuar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleVerify}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium py-3 px-4 rounded-xl transition text-sm sm:text-base cursor-pointer"
          >
            Soy mayor de 18 años
          </button>
          <a
            href="https://www.google.com"
            className="w-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 font-medium py-3 px-4 rounded-xl transition flex items-center justify-center text-sm sm:text-base"
          >
            Salir
          </a>
        </div>
      </div>
    </div>
  )
}
