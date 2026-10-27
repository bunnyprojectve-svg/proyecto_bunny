'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
        router.push('/admin')
      } else if (role === 'talent') {
        router.push('/talent/dashboard')
      } else {
        router.push('/dashboard')
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Revisa tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
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
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-900/20 text-sm cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Autenticando...' : 'Acceder a mi cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-zinc-800 pt-4 space-y-2">
          <p className="text-xs text-zinc-500">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/registro-usuario" className="text-red-500 font-semibold hover:underline">
              Registrarme como Usuario
            </Link>
          </p>
          <p className="text-xs text-zinc-500">
            ¿Eres Creadora?{' '}
            <Link href="/auth/registro-talento" className="text-red-500 font-semibold hover:underline">
              Registro de Talento
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
