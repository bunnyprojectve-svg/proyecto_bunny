// src/app/talent/dashboard/layout.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      
      {/* Menú Lateral Izquierdo para Talentos */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-black text-red-500 tracking-wider">BUNNY Talento</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Panel de Creadora</p>
          </div>

          <nav className="space-y-2 text-sm font-medium">
            <Link href="/talent/dashboard" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">
              📊 Estadísticas y Packs
            </Link>
            <Link href="/catalogo" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">
              ✨ Ver Catálogo General
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition font-semibold cursor-pointer"
          >
            Cerrar Sesión ➔
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}