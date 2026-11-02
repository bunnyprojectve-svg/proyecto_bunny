'client' // (Nota: usar 'use client' en producción)
import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Banner Superior Prediseñado */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border border-red-600/40 p-4 rounded-2xl mb-8 shadow-2xl flex items-center justify-between">
        <h1 className="text-2xl font-black text-red-500 tracking-wider">BUNNY</h1>
        <p className="text-xs text-zinc-300 hidden sm:block">Plataforma Exclusiva de Contenido y Entretenimiento (+18)</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
        >
          Iniciar Sesión
        </button>
      </div>

      {/* Contenido de Presentación */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
          Contenido Exclusivo y Conexiones en Vivo
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Descubre los perfiles de nuestros talentos verificados, adquiere packs exclusivos con vigencia de 30 días y disfruta de transmisiones en streaming de alta calidad.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-red-900/30"
          >
            Acceder a la Plataforma
          </button>
          <Link
            href="/auth/registro-usuario"
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-3 px-8 rounded-xl border border-zinc-800 transition text-sm flex items-center justify-center"
          >
            Registrarse como Usuario
          </Link>
        </div>
      </div>

      {/* Modal Emergente de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/9oid p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-red-500">Iniciar Sesión en BUNNY</h3>
            <p className="text-xs text-zinc-400 mb-6">Ingresa tus credenciales para explorar el catálogo o tu panel.</p>
            {/* Aquí puedes incrustar el formulario de login o redireccionar tras autenticar */}
            <form onSubmit={(e) => { e.preventDefault(); alert('Redirigiendo según rol...'); }} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Correo Electrónico</label>
                <input type="email" required placeholder="tu@correo.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Contraseña</label>
                <input type="password" required placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600" />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer">
                Entrar al Sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}