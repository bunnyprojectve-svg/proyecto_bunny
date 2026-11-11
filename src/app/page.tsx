'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [mostrarModalEdad, setMostrarModalEdad] = useState(true)

  useEffect(() => {
    const esMayor = sessionStorage.getItem('bunny_edad_verificada')
    if (esMayor === 'true') {
      setMostrarModalEdad(false)
    }
  }, [])

  const confirmarMayorEdad = () => {
    sessionStorage.setItem('bunny_edad_verificada', 'true')
    setMostrarModalEdad(false)
  }

  const salirSitio = () => {
    window.location.href = 'https://www.google.com'
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Imagen de Fondo Estática Optimizada */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 filter blur-[2px]"
        style={{ backgroundImage: "url('/landing-bg.jpg')" }}
      />

      {/* Capa de Oscurecimiento para contraste y legibilidad del texto */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-zinc-950" />

      {/* Contenido de Presentación de la Landing Page */}
      <div className={`relative z-10 max-w-2xl mx-auto space-y-6 transition duration-300 ${mostrarModalEdad ? 'blur-md select-none pointer-events-none' : ''}`}>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-lg">
          Contenido Exclusivo y Conexiones en Vivo
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed drop-shadow">
          Descubre los perfiles de nuestros talentos verificados, adquiere packs exclusivos con vigencia de 30 días y disfruta de transmisiones en streaming de alta calidad.
        </p>
        
        {/* Botón de redirección directa a la página de login */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/auth/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition text-sm cursor-pointer shadow-xl shadow-red-950"
          >
            Acceder a la Plataforma
          </Link>
        </div>
      </div>

      {/* Modal Obligatorio de Verificación de Edad (+18) */}
      {mostrarModalEdad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 bg-red-950/80 border border-red-600 rounded-full flex items-center justify-center mx-auto text-red-500 font-black text-xl shadow-lg shadow-red-950">
              +18
            </div>

            <div className="space-y-2">
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                Advertencia de Contenido Explícito
              </span>
              <h3 className="text-2xl font-black mt-2">¿Eres mayor de edad?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Este sitio web contiene material explícito y exclusivo para adultos mayores de 18 años. Debes confirmar tu mayoría de edad para continuar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={confirmarMayorEdad}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition text-xs shadow-lg shadow-red-900/40 cursor-pointer uppercase tracking-wider"
              >
                Soy mayor de 18 años
              </button>
              <button
                onClick={salirSitio}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3.5 rounded-xl transition text-xs border border-zinc-700 cursor-pointer uppercase tracking-wider"
              >
                Salir
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  )
}