'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
// Ajustamos la ruta relativa para importar el fondo desde src/app/
import fondoLanding from '../../landing-bg.webp'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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
        router.push('/admin/dashboard') 
      } else if (role === 'talent') {
        router.push('/talent/dashboard') 
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
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Fondo estático nítido compartido con la landing page */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={fondoLanding} 
          alt="Fondo Bunny Platform"
          fill
          priority
          className="object-cover object-center opacity-75 scale-100"
        />
      </div>

      {/* Sutil capa oscura para mantener contraste */}
      <div className="absolute inset-0 z-0 bg-zinc-950/40 pointer-events-none" />

      {/* Tarjeta del Formulario con efecto Translúcido (Glassmorphism) */}
      <div className="relative z-10 max-w-md w-full bg-zinc-950/75 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        
        <div className="bg-red-950/60 border border-red-600/40 p-2.5 rounded-xl mb-6 text-center text-xs text-red-200">
          ⚠️ <strong>Sitio Exclusivo +18:</strong> Acceso a la Plataforma.
        </div>

        <h1 className="text-2xl font-extrabold text-center mb-1">Iniciar Sesión</h1>
        <p className="text-xs text-zinc-400 text-center mb-6">
          Ingresa con tu correo y contraseña registrados.
        </p>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-600 text-red-200 p-3 rounded-xl mb-6 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Contraseña *
              </label>
            </div>
            <div className="relative w-full">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-sm px-2 py-1 transition cursor-pointer select-none z-10"
                title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-950/60 text-sm cursor-pointer disabled:opacity-50 mt-4 uppercase tracking-wider"
          >
            {loading ? 'Autenticando...' : 'Acceder a mi cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-zinc-800 pt-4">
          <p className="text-xs text-zinc-400">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/registro-usuario" className="text-red-500 font-semibold hover:underline">
              Registrarme como Usuario
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}