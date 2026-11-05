'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MetodoPago {
  id: string
  tipo: string
  alias: string
  detalles: any
}

export default function RegistroUsuarioPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  
  // Estados para el flujo de pago inicial (Momento 1)
  const [userIdRegistrado, setUserIdRegistrado] = useState<string | null>(null)
  const [mostrarModalPago, setMostrarModalPago] = useState(false)
  const [pasarelasActivas, setPasarelasActivas] = useState<MetodoPago[]>([])
  const [pasarelaSeleccionada, setPasarelaSeleccionada] = useState<MetodoPago | null>(null)
  const [hashTransaccion, setHashTransaccion] = useState('')
  const [precioSuscripcion, setPrecioSuscripcion] = useState<number>(15.00) // Precio configurable de membresía

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchPasarelasYConfig()
  }, [])

  const fetchPasarelasYConfig = async () => {
    try {
      const { data: pasarelas, error: pasarelasError } = await supabase
        .from('configuracion_pagos')
        .select('*')
        .eq('activa', true)

      if (!pasarelasError && pasarelas) {
        const pasarelasDisponibles = pasarelas.filter(p => p.tipo !== 'suscripcion_config')
        setPasarelasActivas(pasarelasDisponibles)
        if (pasarelasDisponibles.length > 0) setPasarelaSeleccionada(pasarelasDisponibles[0])
        
        const configPrecio = pasarelas.find(p => p.tipo === 'suscripcion_config')
        if (configPrecio?.detalles?.precio) {
          setPrecioSuscripcion(Number(configPrecio.detalles.precio))
        }
      }
    } catch (err) {
      console.error('Error al cargar pasarelas activas:', err)
    }
  }

  const handleRegistroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!aceptaTerminos) {
      setErrorMsg('Debes aceptar las políticas de no reembolso y términos +18.')
      return
    }

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

      setUserIdRegistrado(userId)
      setLoading(false)
      
      if (pasarelasActivas.length > 0) {
        setMostrarModalPago(true)
      } else {
        alert('Cuenta creada con éxito.')
        router.push('/')
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado durante el registro.')
      setLoading(false)
    }
  }

  const handleCompletarPagoSuscripcion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hashTransaccion.trim() || !userIdRegistrado) return

    setLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_active: true })
        .eq('id', userIdRegistrado)

      if (updateError) throw updateError

      alert('¡Suscripción de acceso activada con éxito!')
      router.push('/catalogo')
    } catch (err: any) {
      setErrorMsg('Error al activar suscripción: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* MODAL DE PAGO INICIAL (MOMENTO 1) */}
      {mostrarModalPago && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="text-xs bg-yellow-950 text-yellow-400 border border-yellow-800 px-3 py-1 rounded-full font-bold uppercase">
                Membresía de Acceso Inicial
              </span>
              <h2 className="text-2xl font-black">Activa tu Cuenta</h2>
              <p className="text-xs text-zinc-400">
                Realiza el pago exacto de <strong className="text-emerald-400">${precioSuscripcion} USD</strong> para desbloquear tu acceso total.
              </p>
            </div>

            <div className="space-y-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Selecciona Método de Pago:</label>
              <div className="flex gap-2">
                {pasarelasActivas.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPasarelaSeleccionada(p)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition border ${pasarelaSeleccionada?.id === p.id ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
                  >
                    {p.tipo.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {pasarelaSeleccionada?.tipo === 'binance_pay' && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-300">Envía el monto a la siguiente cuenta de BinancePay:</p>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-yellow-600/30 font-mono text-xs text-yellow-400">
                    <strong>{pasarelaSeleccionada.alias}:</strong> {pasarelaSeleccionada.detalles?.identifier}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleCompletarPagoSuscripcion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  ID de Transacción / Hash de Pago *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 82374910293847"
                  value={hashTransaccion}
                  onChange={(e) => setHashTransaccion(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl transition shadow-lg text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Confirmar Pago y Acceder'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Formulario Principal de Registro */}
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

        <form onSubmit={handleRegistroSubmit} className="space-y-4">
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
            <div className="relative">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 transition cursor-pointer select-none"
                title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
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