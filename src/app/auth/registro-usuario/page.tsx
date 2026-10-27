'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegistroUsuarioPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!aceptaTerminos) {
      setErrorMsg('Debes aceptar las políticas de no reembolso y términos +18.')
      return
    }

    setMostrarAlerta(true)
  }

  const handleConfirmarRegistro = async () => {
    setMostrarAlerta(false)
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      const userId = authData.user?.id

      if (!userId) throw new Error('No se pudo completar la creación del usuario.')

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        role: 'user',
        is_age_verified: true,
        subscription_active: false,
      })

      if (profileError) throw profileError

      router.push('/')
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado durante el registro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {mostrarAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-red-600/50 rounded-2xl p-6 text-center text-white shadow-2xl">
            <div className="w-12 h-12 bg-red-950 border border-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 font-bold text-xl">
              ⚠️
            </div>
            <h2 className="text-lg font-bold mb-3 text-red-500 uppercase tracking-wide">
              Aviso Importante sobre tus Credenciales
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-left">
              "Atención: Este sistema no almacena métodos de recuperación de contraseñas para usuarios. Si olvida su usuario o contraseña, perderá el acceso y deberá registrarse y suscribirse nuevamente como un usuario nuevo."
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirmarRegistro}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Entendido y Acepto
              </button>
              <button
                onClick={() => setMostrarAlerta(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="bg-red-950/60 border border-red-600/40 p-2.5 rounded-xl mb-6 text-center text-xs text-red-200">
          ⚠️ <strong>Sitio Exclusivo +18:</strong> Registro de Usuario.
        </div>

        <h1 className="text-2xl font-extrabold text-center mb-1">Crear Cuenta de Usuario</h1>
        <p className="text-xs text-zinc-400 text-center mb-6">
          Ingresa tus datos para explorar el catálogo de talentos.
        </p>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-600 text-red-200 p-3 rounded-xl mb-6 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePreSubmit} className="space-y-4">
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
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-1 rounded bg-zinc-950 border-zinc-800 text-red-600 focus:ring-0"
              />
              <span className="text-[11px] text-zinc-400 leading-tight">
                Confirmo que tengo más de 18 años y acepto expresamente la <strong>política de no reembolso</strong> por cancelaciones o packs no disfrutados.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-900/20 text-sm cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Procesando...' : 'Registrarme ahora'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-zinc-800 pt-4">
          <p className="text-xs text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-red-500 font-semibold hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
