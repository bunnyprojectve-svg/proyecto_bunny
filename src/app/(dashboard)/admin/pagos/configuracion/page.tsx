'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminConfigPagosPage() {
  const [pasarelas, setPasarelas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estado para crear nueva pasarela
  const [tipoPasarela, setTipoPasarela] = useState('binance_pay')
  const [alias, setAlias] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchPasarelas()
  }, [])

  const fetchPasarelas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('configuracion_pagos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPasarelas(data || [])
    } catch (err: any) {
      console.error('Error al cargar pasarelas:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCrearPasarela = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    try {
      const { error } = await supabase
        .from('configuracion_pagos')
        .insert({
          tipo_pasarela: tipoPasarela,
          alias,
          activa: true,
          detalles: { identifier }
        })

      if (error) throw error

      setAlias('')
      setIdentifier('')
      fetchPasarelas()
    } catch (err: any) {
      setErrorMsg('Error al crear pasarela: ' + err.message)
    }
  }

  const toggleEstado = async (id: string, estadoActual: boolean) => {
    try {
      const { error } = await supabase
        .from('configuracion_pagos')
        .update({ activa: !estadoActual })
        .eq('id', id)

      if (error) throw error
      fetchPasarelas()
    } catch (err: any) {
      alert('Error al cambiar estado: ' + err.message)
    }
  }

  const eliminarPasarela = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este método de pago?')) return
    try {
      const { error } = await supabase
        .from('configuracion_pagos')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPasarelas()
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black">💳 Configuración de Pasarelas de Pago</h1>
        <p className="text-xs text-zinc-400 mt-1">Agrega, activa, suspende o elimina métodos de pago en tiempo real para toda la plataforma.</p>
      </div>

      {/* Formulario para Agregar Nuevo Método */}
      <form onSubmit={handleCrearPasarela} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-rose-500">➕ Agregar Nuevo Método de Pago</h2>
        
        {errorMsg && <div className="bg-red-950/80 border border-red-600 text-red-200 p-3 rounded-xl text-xs">{errorMsg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Tipo de Pasarela</label>
            <select
              value={tipoPasarela}
              onChange={(e) => setTipoPasarela(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-600"
            >
              <option value="binance_pay">BinancePay</option>
              <option value="ccbill">CCBill (Próximamente)</option>
              <option value="nowpayments">NowPayments (Crypto)</option>
              <option value="pago_movil">Pago Móvil</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Alias Descriptivo</label>
            <input
              type="text"
              required
              placeholder="Ej. Binance Principal"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Identificador / Cuenta (Pay ID / Wallet)</label>
            <input
              type="text"
              required
              placeholder="Ej. 123456789"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:border-rose-600 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl transition text-xs cursor-pointer shadow-lg shadow-rose-900/30"
        >
          Guardar Método de Pago
        </button>
      </form>

      {/* Listado de Métodos Existentes con Control de Estado */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">📋 Métodos Registrados en Sistema</h2>

        {loading ? (
          <p className="text-xs text-zinc-500">Cargando métodos...</p>
        लेक्ट्रonik : pasarelas.length === 0 ? (
          <p className="text-xs text-zinc-500">No hay métodos de pago configurados.</p>
        ) : (
          <div className="space-y-3">
            {pasarelas.map((p) => (
              <div key={p.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase">{p.tipo_pasarela}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${p.activa ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                      {p.activa ? 'Activo' : 'Suspendido'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 mt-1">{p.alias}</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">ID / Cuenta: {p.detalles?.identifier || 'N/A'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEstado(p.id, p.activa)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${p.activa ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    {p.activa ? 'Suspender' : 'Activar'}
                  </button>
                  <button
                    onClick={() => eliminarPasarela(p.id)}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}