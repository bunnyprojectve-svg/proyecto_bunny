'use client'

import { useState } from 'react'

export default function TalentDashboardPage() {
  const [mostrarModalSoporte, setMostrarModalSoporte] = useState(false)
  const [mensajeSoporte, setMensajeSoporte] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleEnviarSoporte = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
    setTimeout(() => {
      setEnviado(false)
      setMostrarModalSoporte(false)
      setMensajeSoporte('')
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 pb-20">
      {mostrarModalSoporte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setMostrarModalSoporte(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-2">Soporte Técnico / Desarrolladores</h2>
            <p className="text-xs text-zinc-400 mb-4">
              Envía una solicitud directa a los desarrolladores para el cambio o restablecimiento de credenciales de tu perfil de talento.
            </p>

            {enviado ? (
              <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 p-4 rounded-xl text-center text-xs">
                ✓ Mensaje enviado correctamente a los desarrolladores.
              </div>
            ) : (
              <form onSubmit={handleEnviarSoporte} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  value={mensajeSoporte}
                  onChange={(e) => setMensajeSoporte(e.target.value)}
                  placeholder="Describe la solicitud o el cambio de contraseña requerido..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 transition resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Enviar Notificación a Desarrolladores
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold mb-1">Panel Privado de Creadora</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Estadísticas automatizadas de rendimiento y gestión de perfil.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-semibold">
              ✓ Exenta de Suscripción
            </span>
            <button
              onClick={() => setMostrarModalSoporte(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-xl border border-zinc-700 transition cursor-pointer"
            >
              🔑 Soporte / Credenciales
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Visitas a tu Perfil (Esta Semana)
            </h3>
            <p className="text-4xl font-black text-white mt-3">342</p>
            <p className="text-xs text-zinc-500 mt-2">Usuarios únicos explorando tus muestras públicas</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Packs Adquiridos (Esta Semana)
            </h3>
            <p className="text-4xl font-black text-red-500 mt-3">18</p>
            <p className="text-xs text-zinc-500 mt-2">Corresponde al 70% de dividendo asignado</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-base font-bold mb-2 text-white">Carga de Material y Producción</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Recuerda que la carga de videos e imágenes compuestas para tus packs de venta en Bunny Stream es gestionada de manera exclusiva por el equipo de desarrolladores para garantizar el estándar de calidad técnica y protección anti-descargas.
          </p>
        </div>
      </div>
    </main>
  )
}
