'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* Contenido de Presentación de la Landing Page */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
          Contenido Exclusivo y Conexiones en Vivo
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Descubre los perfiles de nuestros talentos verificados, adquiere packs exclusivos con vigencia de 30 días y disfruta de transmisiones en streaming de alta calidad.
        </p>
        
        {/* Botón de redirección directa a la página de login */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/auth/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-red-900/30"
          >
            Acceder a la Plataforma
          </Link>
        </div>
      </div>

    </main>
  )
}