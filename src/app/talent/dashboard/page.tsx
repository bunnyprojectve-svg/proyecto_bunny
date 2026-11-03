'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function TalentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  // Estados del perfil
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [biografia, setBiografia] = useState('')
  const [fotoPortada, setFotoPortada] = useState('')
  
  // Galería (hasta 4 URLs)
  const [galeria1, setGaleria1] = useState('')
  const [galeria2, setGaleria2] = useState('')
  const [galeria3, setGaleria3] = useState('')
  const [galeria4, setGaleria4] = useState('')

  // Métodos de Pago
  const [binancePay, setBinancePay] = useState('')
  const [banco, setBanco] = useState('')
  const [cedula, setCedula] = useState('')
  const [telefonoPagoMovil, setTelefonoPagoMovil] = useState('')
  const [numeroCuenta, setNumeroCuenta] = useState('')

  // Métricas de prueba para el demo
  const [visitasTotales] = useState(4230)
  const [packsVendidos] = useState(145)
  const [gananciasTotales] = useState(3850.00)

  const [packsArtista] = useState([
    { id: 1, titulo: 'Pack Exclusivo Fotos & Videos - Octubre', precio: 19.99, estado: 'Activo', ventas: 95 },
    { id: 2, titulo: 'Suscripción Anual VIP', precio: 149.99, estado: 'Activo', ventas: 50 },
  ])

  useEffect(() => {
    fetchTalentData()
  }, [])

  const fetchTalentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('artistas')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setNombre(data.nombre || '')
        setSlug(data.slug || '')
        setBiografia(data.biografia || '')
        setFotoPortada(data.foto_portada || '')
        
        const galeria = data.fotos_galeria || []
        setGaleria1(galeria[0] || '')
        setGaleria2(galeria[1] || '')
        setGaleria3(galeria[2] || '')
        setGaleria4(galeria[3] || '')

        setBinancePay(data.binance_pay || '')
        setBanco(data.banco || '')
        setCedula(data.cedula || '')
        setTelefonoPagoMovil(data.telefono_pago_movil || '')
        setNumeroCuenta(data.numero_cuenta || '')
      }
    } catch (err) {
      console.error('Error al cargar datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No hay sesión activa.')

      const fotosArray = [galeria1, galeria2, galeria3, galeria4].filter(Boolean)

      const { error } = await supabase
        .from('artistas')
        .update({
          nombre: nombre,
          biografia: biografia,
          foto_portada: fotoPortada,
          fotos_galeria: fotosArray,
          binance_pay: binancePay,
          banco: banco,
          cedula: cedula,
          telefono_pago_movil: telefonoPagoMovil,
          numero_cuenta: numeroCuenta,
        })
        .eq('id', user.id)

      if (error) throw error

      setMensaje('¡Perfil, galería y datos de pago actualizados con éxito en Supabase!')
    } catch (err: any) {
      setMensaje('Error al actualizar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-zinc-400">Cargando panel de creadora...</div>
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-rose-500/50 bg-zinc-800">
              <img src={fotoPortada || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'} alt={nombre} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Panel de Artista
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight mt-1">Bienvenida, {nombre}</h1>
            </div>
          </div>

          {slug && (
            <Link
              href={`/artistas/${slug}`}
              target="_blank"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              Ver mi Perfil Público ↗
            </Link>
          )}
        </div>

        {/* 1. Tarjetas de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Visitas en tu Perfil</p>
            <h3 className="text-3xl font-black text-white">👁️ {visitasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Tráfico registrado en tu ruta pública</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Packs Vendidos</p>
            <h3 className="text-3xl font-black text-white">📦 {packsVendidos}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Total de ventas registradas</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Tus Ganancias Netas</p>
            <h3 className="text-3xl font-black text-emerald-400">${gananciasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Calculado tras comisión de plataforma</span>
          </div>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${mensaje.includes('Error') ? 'bg-red-950/80 border border-red-600 text-red-200' : 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'}`}>
            {mensaje}
          </div>
        )}

        {/* 2. Sección Principal: Gestión de Perfil (Fotos y Biografía) + Packs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de Gestión de Perfil, Galería y Métodos de Pago */}
          <form onSubmit={handleGuardarCambios} className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Tu Perfil y Pagos</h2>
              <p className="text-zinc-400 text-xs mb-6">Actualiza tus fotos vía Bunny Stream y métodos de recepción de dinero.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Nombre Artístico</label>
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Biografía</label>
                  <textarea 
                    rows={3}
                    maxLength={300}
                    value={biografia}
                    onChange={(e) => setBiografia(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">Foto de Portada (URL Bunny / CDN) *</label>
                  <input 
                    type="url" 
                    required
                    value={fotoPortada}
                    onChange={(e) => setFotoPortada(e.target.value)}
                    placeholder="https://tu-storage.b-cdn.net/portada.jpg"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Fotos de Galería (URLs CDN - Hasta 4)</label>
                  <div className="space-y-2">
                    <input type="url" value={galeria1} onChange={(e) => setGaleria1(e.target.value)} placeholder="URL Foto opcional 1" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                    <input type="url" value={galeria2} onChange={(e) => setGaleria2(e.target.value)} placeholder="URL Foto opcional 2" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                    <input type="url" value={galeria3} onChange={(e) => setGaleria3(e.target.value)} placeholder="URL Foto opcional 3" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                    <input type="url" value={galeria4} onChange={(e) => setGaleria4(e.target.value)} placeholder="URL Foto opcional 4" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Métodos de Cobro / Pago</h3>
                  
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">BinancePay (Correo o ID)</label>
                    <input type="text" value={binancePay} onChange={(e) => setBinancePay(e.target.value)} placeholder="tucorreo@binance.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Banco Nacional</label>
                      <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Ej. Banesco" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Cédula de Identidad</label>
                      <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="V-12345678" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Teléfono para Pago Móvil</label>
                    <input type="tel" value={telefonoPagoMovil} onChange={(e) => setTelefonoPagoMovil(e.target.value)} placeholder="04120000000" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Número de Cuenta Bancaria</label>
                    <input type="text" value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} placeholder="20 dígitos" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500" />
                  </div>
                </div>

              </div>
            </div>

            <button 
              type="submit" 
              disabled={guardando}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-lg shadow-rose-600/20 cursor-pointer"
            >
              {guardando ? 'Guardando en Supabase...' : 'Guardar Cambios de Perfil'}
            </button>
          </form>

          {/* Listado de Packs */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Tus Packs Multimedia</h2>
                  <p className="text-zinc-400 text-xs mt-1">Los videos y contenido pesado de estos packs son configurados por el equipo de desarrollo mediante Bunny Stream.</p>
                </div>
              </div>

              <div className="space-y-4">
                {packsArtista.map((pack) => (
                  <div key={pack.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          {pack.estado}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">Ventas: {pack.ventas}</span>
                      </div>
                      <h3 className="font-bold text-base">{pack.titulo}</h3>
                      <span className="text-rose-400 font-bold text-sm">${pack.precio} USD</span>
                    </div>

                    <div className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg">
                      🎥 Gestionado vía Bunny Stream
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
              <p className="text-xs text-zinc-400">
                ¿Necesitas agregar un nuevo pack multimedia o actualizar videos en alta definición? <br />
                <span className="text-rose-400 font-medium">Contacta al Administrador / Desarrollador de la plataforma.</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}