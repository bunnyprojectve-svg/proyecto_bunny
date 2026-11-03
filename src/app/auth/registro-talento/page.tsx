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
  const [descripcion, setDescripcion] = useState('')
  
  // Fotos (Portada y Galería vía URLs de Bunny Stream / CDN)
  const [fotoPortada, setFotoPortada] = useState('')
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
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value
    if (texto.length <= 300) {
      setDescripcion(texto)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!fotoPortada.trim()) {
      setErrorMsg('Debes ingresar la URL de la foto de portada obligatoria.')
      return
    }

    setLoading(true)

    try {
      // 1. Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      const userId = authData.user?.id
      if (!userId) throw new Error('No se pudo obtener el ID del usuario.')

      // 2. Insertar en la tabla profiles
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        role: 'talent',
        is_age_verified: true,
        subscription_active: true,
      })

      if (profileError) throw profileError

      const slug = nombreArtistico.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      const fotosArray = [galeria1, galeria2, galeria3, galeria4].filter(Boolean)
      
      // 3. Insertar TODOS los datos del formulario (incluyendo galería y datos de pago) en la tabla artistas
      const { error: artistaError } = await supabase.from('artistas').insert({
        id: userId,
        nombre: nombreArtistico,
        nombre_legal: nombreApellido,
        slug: slug,
        biografia: descripcion,
        foto_portada: fotoPortada,
        fotos_galeria: fotosArray,
        telefono: telefono,
        binance_pay: binancePay || null,
        banco: banco || null,
        cedula: cedula || null,
        telefono_pago_movil: telefonoPagoMovil || null,
        numero_cuenta: numeroCuenta || null,
        activo: true,
      })

      if (artistaError) throw artistaError

      setSuccessMsg('¡Registro de talento completado exitosamente! Redirigiendo...')
      setTimeout(() => {
        router.push('/talent/dashboard')
      }, 2000)

    } catch (err: any) {
      console.error('Error detallado en registro:', err)
      setErrorMsg(err.message || 'Ocurrió un error inesperado durante el registro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div className="bg-rose-950/60 border border-rose-600/40 p-3 rounded-xl mb-6 text-center text-xs text-rose-200">
          ⚠️ <strong>Plataforma Exclusiva +18:</strong> Formulario de registro oficial para talentos verificados.
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center">Registro de Nuevo Talento</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mb-8 text-center">
          Completa tus datos personales, añade las URLs de tu contenido (Bunny Stream) y configura tus métodos de pago.
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
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
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
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Descripción / Biografía *
              </label>
              <span className={`text-xs font-bold ${descripcion.length === 300 ? 'text-rose-500' : 'text-zinc-500'}`}>
                {descripcion.length} / 300 caracteres
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={handleDescripcionChange}
              placeholder="Cuéntale a tus seguidores sobre ti (máximo 300 caracteres)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rose-500 transition resize-none"
            />
          </div>

          {/* Fotos vía URL (Bunny Stream / CDN) */}
          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Imágenes del Perfil (URLs Bunny / CDN)</h3>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                URL de la Foto de Portada (Obligatoria) *
              </label>
              <input
                type="url"
                required
                value={fotoPortada}
                onChange={(e) => setFotoPortada(e.target.value)}
                placeholder="https://tu-storage.b-cdn.net/portada.jpg"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Fotos de Galería Opcionales (Hasta 4 URLs)
              </label>
              <div className="space-y-2">
                <input type="url" value={galeria1} onChange={(e) => setGaleria1(e.target.value)} placeholder="URL Foto opcional 1" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
                <input type="url" value={galeria2} onChange={(e) => setGaleria2(e.target.value)} placeholder="URL Foto opcional 2" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
                <input type="url" value={galeria3} onChange={(e) => setGaleria3(e.target.value)} placeholder="URL Foto opcional 3" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
                <input type="url" value={galeria4} onChange={(e) => setGaleria4(e.target.value)} placeholder="URL Foto opcional 4" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500" />
              </div>
            </div>
          </div>

          {/* Métodos de Pago */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Métodos de Cobro (BinancePay o Datos Bancarios Nacionales)</h3>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                BinancePay (Correo o ID - Opcional si usas pago nacional)
              </label>
              <input
                type="text"
                value={binancePay}
                onChange={(e) => setBinancePay(e.target.value)}
                placeholder="tucorreo@binance.com o ID"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Banco Nacional</label>
                <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Ej. Banesco / Venezuela" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Cédula de Identidad</label>
                <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="V-12345678" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Teléfono para Pago Móvil</label>
                <input type="tel" value={telefonoPagoMovil} onChange={(e) => setTelefonoPagoMovil(e.target.value)} placeholder="04120000000" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Número de Cuenta Bancaria</label>
                <input type="text" value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} placeholder="20 dígitos" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-rose-900/20 text-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Registrando talento...' : 'Completar Registro de Talento'}
          </button>
        </form>
      </div>
    </main>
  )
}