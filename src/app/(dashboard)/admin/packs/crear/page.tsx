'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

interface ItemContenido {
  tipo: 'foto' | 'video'
  recurso_url: string
}

export default function CrearPackAdminPage() {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  // Campos del Pack (coincidiendo con las columnas de tu BD)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [incluyeVideollamada, setIncluyeVideollamada] = useState(false)

  // Lista de contenidos (fotos y videos con URL de Bunny Stream)
  const [items, setItems] = useState<ItemContenido[]>([{ tipo: 'foto', recurso_url: '' }])

  const handleAgregarItem = () => {
    setItems([...items, { tipo: 'foto', recurso_url: '' }])
  }

  const handleEliminarItem = (index: number) => {
    const nuevosItems = items.filter((_, i) => i !== index)
    setItems(nuevosItems)
  }

  const handleItemChange = (index: number, campo: keyof ItemContenido, valor: string) => {
    const nuevosItems = [...items]
    nuevosItems[index][campo] = valor as any
    setItems(nuevosItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')

    try {
      // 1. Insertar el pack principal en la tabla 'packs'
      const { data: packInsertado, error: packError } = await supabase
        .from('packs')
        .insert({
          titulo,
          descripcion,
          precio: parseFloat(precio) || 0,
          incluye_videollamada: incluyeVideollamada,
        })
        .select('id')
        .single()

      if (packError) throw packError
      const packId = packInsertado.id

      // 2. Insertar los contenidos asociados en la tabla 'pack_contenido'
      const contenidosParaInsertar = items
        .filter(item => item.recurso_url.trim() !== '')
        .map((item, index) => ({
          pack_id: packId,
          tipo: item.tipo,
          recurso_url: item.recurso_url,
          orden: index + 1,
        }))

      if (contenidosParaInsertar.length > 0) {
        const { error: contenidoError } = await supabase
          .from('pack_contenido')
          .insert(contenidosParaInsertar)

        if (contenidoError) throw contenidoError
      }

      setMensaje('¡Pack y contenido multimedia creados con éxito en Supabase!')
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)

    } catch (err: any) {
      setMensaje('Error al crear el pack: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navegación */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <Link href="/admin/dashboard" className="text-xs text-zinc-400 hover:text-white transition">
            ← Volver al Panel de Admin
          </Link>
          <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-3 py-1 rounded-full font-bold uppercase">
            Gestión de Contenido
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black">Crear Nuevo Pack Multimedia</h1>
          <p className="text-zinc-400 text-sm mt-1">Configura los detalles del pack y adjunta las URLs de Bunny Stream para los videos y de almacenamiento para las fotos.</p>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm ${mensaje.includes('Error') ? 'bg-red-950/80 border border-red-600 text-red-200' : 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-6">
          
          {/* Información Básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-red-400">1. Información General del Pack</h2>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Título del Pack</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Pack Exclusivo - Noviembre"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Descripción</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe lo que incluye este pack..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Precio (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="19.99"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluyeVideollamada}
                    onChange={(e) => setIncluyeVideollamada(e.target.checked)}
                    className="w-5 h-5 accent-red-600 rounded bg-zinc-950 border-zinc-800"
                  />
                  <span className="text-sm font-medium text-white">¿Incluye Videollamada (15 min)?</span>
                </label>
              </div>
            </div>
          </div>

          {/* Carga de Contenidos (URLs de Bunny Stream / Fotos) */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-red-400">2. Contenido Multimedia (URLs)</h2>
              <button
                type="button"
                onClick={handleAgregarItem}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                + Agregar Elemento
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <select
                    value={item.tipo}
                    onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="foto">Foto</option>
                    <option value="video">Video (Bunny Stream)</option>
                  </select>

                  <input
                    type="url"
                    required
                    value={item.recurso_url}
                    onChange={(e) => handleItemChange(index, 'recurso_url', e.target.value)}
                    placeholder="https://iframe.mediadelivery.net/... o URL de imagen"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarItem(index)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botón de Guardado */}
          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-950/40 text-sm disabled:opacity-50"
          >
            {guardando ? 'Guardando pack...' : 'Crear Pack y Publicar Contenido'}
          </button>

        </form>

      </div>
    </main>
  )
}