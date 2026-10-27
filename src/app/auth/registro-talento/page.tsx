'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegistroTalentoPage() {
  const router = useRouter()
  
  const [nombreApellido, setNombreApellido] = useState('')
  const [nombreArtistico, setNombreArtistico] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [binancePay, setBinancePay] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fotos, setFotos] = useState<File[]>([])
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value
    if (texto.length <= 300) {
      setDescripcion(texto)
    }
  }

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (selectedFiles.length > 5) {
        alert('Solo puedes cargar un máximo de 5 fotos.')
        return
      }
      setFotos(selectedFiles)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (fotos.length === 0) {
      setErrorMsg('Debes subir al menos 1 foto obligatoria para tu perfil.')
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

      if (!userId) throw new Error('No se pudo obtener el ID del usuario.')

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        role: 'talent',
        is_age_verified: true,
        subscription_active: true,
      })

      if (profileError) throw profileError

      const slug = nombreArtistico.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      
      const { error: artistaError } = await supabase.from('artistas').insert({
        id: userId,
        nombre: nombreArtistico,
        slug: slug,
        biografia: descripcion,
        foto_portada: fotos[0] ? URL.createObjectURL(fotos[0]) : null, 
        activo: true,
      })

      if (artistaError) throw artistaError

      setSuccessMsg('¡Registro de talento completado exitosamente! Ya puedes acceder a tu panel.')
      setTimeout(() => {
        router.push('/talent/dashboard')
      }, 2000)

    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error durante el registro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div className="bg-red-950/60 border border-red-600/40 p-3 rounded-xl mb-6 text-center text-xs text-red-200">
          ⚠️ <strong>Plataforma Exclusiva +18:</strong> Formulario de registro oficial para talentos verificados.
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center">Registro de Nuevo Talento</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mb-8 text-center">
          Completa tus datos para configurar tu perfil público y comenzar a gestionar tus packs exclusivos.
        </p>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-600 text-red-200 p-3 rounded-xl mb-6 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 p-3 rounded-xl mb-6 text-xs sm:text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Nombre y Apellido (Uso Privado / Legal) *
            </label>
            <input
              type="text"
              required
              value={nombreApellido}
              onChange={(e) => setNombreApellido(e.target.value)}
              placeholder="Ej. María Pérez"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Nombre Artístico (Nombre Público) *
            </label>
            <input
              type="text"
              required
              value={nombreArtistico}
              onChange={(e) => setNombreArtistico(e.target.value)}
              placeholder="Ej. BunnyBunny"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Correo Electrónico (Obligatorio) *
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+58 412 0000000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Datos de BinancePay (Opcional inicial)
              </label>
              <input
                type="text"
                value={binancePay}
                onChange={(e) => setBinancePay(e.target.value)}
                placeholder="Email o ID de Binance"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Descripción / Biografía *
              </label>
              <span className={`text-xs font-bold ${descripcion.length === 300 ? 'text-red-500' : 'text-zinc-500'}`}>
                {descripcion.length} / 300 caracteres
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={handleDescripcionChange}
              placeholder="Cuéntale a tus seguidores sobre ti (máximo 300 caracteres)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Fotos de Perfil / Muestra (1 obligatoria, hasta 4 opcionales) *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handleFotosChange}
              className="w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-900/20 text-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Registrando talento...' : 'Completar Registro de Talento'}
          </button>
        </form>
      </div>
    </main>
  )
}
