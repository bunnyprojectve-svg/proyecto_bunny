'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface CuentaBinance {
  id: string
  identifier: string // Correo o Pay ID
  alias: string      // Nombre descriptivo (ej. "Cuenta Principal 1")
  activa: boolean
}

export default function ConfiguracionPagosAdminPage() {
  const [cuentasBinance, setCuentasBinance] = useState<CuentaBinance[]>([])
  const [nuevoAlias, setNuevoAlias] = useState('')
  const [nuevoIdentifier, setNuevoIdentifier] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    fetchConfiguracionPagos()
  }, [])

  const fetchConfiguracionPagos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('configuracion_pagos')
        .select('*')
        .eq('tipo', 'binance_pay')
        .order('created_at', { ascending: true })

      if (!error && data) {
        setCuentasBinance(
          data.map((item: any) => ({
            id: item.id,
            alias: item.alias || 'Binance Pay',
            identifier: item.detalles?.identifier || '',
            activa: item.activa ?? true,
          }))
        )
      }
    } catch (err) {
      console.error('Error al cargar metodos de pago:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarCuentaBinance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoIdentifier.trim()) return

    setGuardando(true)
    setMensaje('')

    try {
      const { data, error } = await supabase
        .from('configuracion_pagos')
        .insert({
          tipo: 'binance_pay',
          alias: nuevoAlias || 'Cuenta BinancePay',
          detalles: { identifier: nuevoIdentifier.trim() },
          activa: true,
        })
        .select()
        .single()

      if (error) throw error

      setCuentasBinance([
        ...cuentasBinance,
        {
          id: data.id,
          alias: data.alias,
          identifier: nuevoIdentifier.trim(),
          activa: true,
        },
      ])

      setNuevoAlias('')
      setNuevoIdentifier('')
      setMensaje('¡Cuenta BinancePay agregada con éxito!')
    } catch (err: any) {
      setMensaje('Error al agregar cuenta: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleToggleEstado = async (id: string, estadoActual: boolean) => {
    try {
      const { error } = await supabase
        .from('configuracion_pagos')
        .update({ activa: !estadoActual })
        .eq('id', id)

      if (error) throw error

      setCuentasBinance(
        cuentasBinance.map((c) => (c.id === id ? { ...c, activa: !estadoActual } : c))
      )
    } catch (err: any) {
      alert('Error al cambiar estado: ' + err.message)
    }
  }

  const handleEliminarCuenta = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta cuenta de BinancePay?')) return

    try {
      const { error } = await supabase
        .from('configuracion_pagos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCuentasBinance(cuentasBinance.filter((c) => c.id !== id))
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Cargando configuración de pasarelas...</div>
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navegación superior */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <Link href="/admin/dashboard" className="text-xs text-zinc-400 hover:text-white transition">
            ← Volver al Panel de Admin
          </Link>
          <span className="text-xs bg-yellow-950 text-yellow-400 border border-yellow-800 px-3 py-1 rounded-full font-bold uppercase">
            Configuración de Cobros
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Pasarelas y Cuentas de Cobro</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Administra las direcciones de BinancePay donde los usuarios enviarán los pagos. Las demás pasarelas permanecen deshabilitadas.</p>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm ${mensaje.includes('Error') ? 'bg-red-950/80 border border-red-600 text-red-200' : 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'}`}>
            {mensaje}
          </div>
        )}

        {/* 1. SECCIÓN ACTIVA: BinancePay */}
        <div className="bg-zinc-900 border border-yellow-600/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟡</span>
              <div>
                <h2 className="text-lg font-bold text-yellow-400">BinancePay (Pasarela Activa)</h2>
                <p className="text-xs text-zinc-400">Puedes habilitar múltiples cuentas/IDs para distribuir la recepción de pagos.</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full uppercase font-bold">
              En Uso
            </span>
          </div>

          {/* Formulario para agregar nueva cuenta BinancePay */}
          <form onSubmit={handleAgregarCuentaBinance} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase">+ Agregar Nueva Cuenta de BinancePay</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Alias (ej. Cuenta Binance 1)"
                value={nuevoAlias}
                onChange={(e) => setNuevoAlias(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                required
                placeholder="Correo BinancePay o Pay ID *"
                value={nuevoIdentifier}
                onChange={(e) => setNuevoIdentifier(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar Cuenta BinancePay'}
            </button>
          </form>

          {/* Listado de Cuentas Agregadas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase">Cuentas Registradas ({cuentasBinance.length})</h3>
            
            {cuentasBinance.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No hay cuentas de BinancePay registradas aún.</p>
            ) : (
              <div className="divide-y divide-zinc-800">
                {cuentasBinance.map((cuenta) => (
                  <div key={cuenta.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{cuenta.alias}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cuenta.activa ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'}`}>
                          {cuenta.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-400/90 font-mono mt-0.5">{cuenta.identifier}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEstado(cuenta.id, cuenta.activa)}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition"
                      >
                        {cuenta.activa ? 'Desactivar' : 'Activar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEliminarCuenta(cuenta.id)}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1.5 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. SECCIONES DESHABILITADAS / TRANSPARENCIA */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Otras Pasarelas (Deshabilitadas Temporalmente)</h2>

          {/* Tarjetas de Crédito / CCBill */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl opacity-50 pointer-events-none flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="font-bold text-sm text-zinc-300">CCBill / Tarjetas Internacionales</h3>
                <p className="text-xs text-zinc-500">Procesamiento automático vía tarjeta de débito/crédito.</p>
              </div>
            </div>
            <span className="text-xs bg-zinc-950 text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase font-bold">
              Deshabilitado
            </span>
          </div>

          {/* NOWPayments */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl opacity-50 pointer-events-none flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔷</span>
              <div>
                <h3 className="font-bold text-sm text-zinc-300">NOWPayments (Criptomonedas Altcoins)</h3>
                <p className="text-xs text-zinc-500">Acepta USDT, BTC, ETH de múltiples redes.</p>
              </div>
            </div>
            <span className="text-xs bg-zinc-950 text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase font-bold">
              Deshabilitado
            </span>
          </div>

          {/* Pago Móvil Nacional */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl opacity-50 pointer-events-none flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏦</span>
              <div>
                <h3 className="font-bold text-sm text-zinc-300">Pago Móvil / Transferencia Nacional</h3>
                <p className="text-xs text-zinc-500">Transferencias bancarias locales.</p>
              </div>
            </div>
            <span className="text-xs bg-zinc-950 text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase font-bold">
              Deshabilitado
            </span>
          </div>
        </div>

      </div>
    </main>
  )
}