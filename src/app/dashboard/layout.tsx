'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [role, setRole] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkUserRole()
  }, [])

  const checkUserRole = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        // Si no hay sesión, puedes redirigir al login si lo deseas
        setLoading(false)
        return
      }

      // 1. Consultar el rol en la tabla 'profiles'
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      const userRole = profileData?.role || 'user'
      setRole(userRole)

      // 2. Si es artista, buscar su slug en la tabla 'artistas' para el enlace de su perfil público
      if (userRole === 'talent') {
        const { data: artistaData } = await supabase
          .from('artistas')
          .select('slug')
          .eq('id', user.id)
          .single()

        if (artistaData) {
          setUserSlug(artistaData.slug)
        }
      }
    } catch (err) {
      console.error('Error al verificar el rol del usuario:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login') // Ajusta tu ruta de login si es distinta
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Cargando panel...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      
      {/* Menú Lateral Dinámico */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Identificador de Panel según el Rol */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-zinc-800 text-zinc-300 border-zinc-700">
              {role === 'talent' && '🐰 Panel de Artista'}
              {role === 'admin' && '🛡️ Panel de Admin'}
              {role === 'user' && '👤 Panel de Usuario'}
            </span>
          </div>

          {/* Opciones de Navegación */}
          <nav className="space-y-2">
            
            {/* El catálogo lo ven TODOS */}
            <Link 
              href="/dashboard/catalogo" 
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${pathname === '/catalogo' ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
            >
              ✨ Catálogo de Talentos
            </Link>

            {/* Opciones exclusivas para TALENT (Artista) */}
            {role === 'talent' && (
              <>
                <Link 
                  href="/dashboard/talent/dashboard" 
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${pathname === '/talent/dashboard' ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                >
                  📊 Mi Panel de Control
                </Link>

                {userSlug && (
                  <Link 
                    href={`/artistas/${userSlug}`} 
                    target="_blank"
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                  >
                    👁️ Ver mi Perfil Público ↗
                  </Link>
                )}
              </>
            )}

            {/* Opciones exclusivas para USER (Usuario normal / Suscriptor) */}
            {role === 'user' && (
              <Link 
                href="/dashboard/perfil" 
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${pathname === '/perfil' ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
              >
                👤 Mi Perfil y Puntos
              </Link>
            )}

            {/* Opciones exclusivas para ADMIN (El admin no tiene perfil público) */}
            {role === 'admin' && (
              <Link 
                href="/dashboard/admin/dashboard" 
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${pathname === '/admin/dashboard' ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
              >
                ⚙️ Gestión de Artistas y Pagos
              </Link>
            )}

          </nav>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="pt-6 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition cursor-pointer"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Dinámico de la Página Activa */}
      <div className="flex-1 p-6 sm:p-10 bg-zinc-950 overflow-y-auto">
        {children}
      </div>

    </div>
  )
}