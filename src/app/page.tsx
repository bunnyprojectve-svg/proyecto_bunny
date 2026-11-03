'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LandingPage() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  
  // Estados para el Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Función de inicio de sesión y redirección por rol
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError
      const userId = authData.user?.id
      if (!userId) throw new Error('No se pudo autenticar el usuario.')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError
      const role = profile?.role

      if (role === 'admin' || role === 'developer' || role === 'supervisor') {
        router.push('/admin')
      } else if (role === 'talent') {
        router.push('/dashboard/talent/dashboard')
      } else {
        router.push('/catalogo')
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Revisa tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

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
        
        {/* Botones principales actualizados */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-red-900/30"
          >
            Acceder a la Plataforma
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-3 px-8 rounded-xl border border-zinc-800 transition text-sm flex items-center justify-center cursor-pointer"
          >
            Registrarse
          </button>
        </div>
      </div>

      {/* Modal Emergente de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-red-500">Iniciar Sesión en BUNNY</h3>
            <p className="text-xs text-zinc-400 mb-6">Ingresa tus credenciales para explorar el catálogo o tu panel.</p>
            
            {errorMsg && (
              <div className="bg-red-950/80 border border-red-600 text-red-200 p-3 rounded-xl mb-4 text-xs text-left">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Autenticando...' : 'Entrar al Sistema'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Emergente de Selección de Registro (Artista o Usuario) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white shadow-2xl relative text-center">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-red-500">Selecciona tu Tipo de Registro</h3>
            <p className="text-xs text-zinc-400 mb-6">Elige cómo deseas unirte a la plataforma BUNNY.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/registro-usuario')}
                className="w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold py-3.5 px-4 rounded-xl transition text-sm flex items-center justify-between cursor-pointer"
              >
                <span>👤 Registrarme como Usuario</span>
                <span className="text-red-500">➔</span>
              </button>

              <button
                onClick={() => router.push('/auth/registro-talento')}
                className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/40 text-red-400 font-semibold py-3.5 px-4 rounded-xl transition text-sm flex items-center justify-between cursor-pointer"
              >
                <span>✨ Registrarme como Artista (Talento)</span>
                <span className="text-red-500">➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}