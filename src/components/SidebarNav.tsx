'use client'
import Link from 'next/link'

export default function SidebarNav({ role }: { role: 'user' | 'talent' | 'admin' | 'supervisor' }) {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between min-h-screen hidden md:flex">
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-black text-red-500 tracking-wider">BUNNY</h2>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Panel {role}</p>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          {role === 'user' && (
            <>
              <Link href="/catalogo" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">✨ Catálogo de Talentos</Link>
              <Link href="/perfil" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">👤 Mi Perfil y Puntos</Link>
            </>
          )}

          {role === 'talent' && (
            <>
              <Link href="/talent/dashboard" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">📊 Dashboard de Creadora</Link>
              <Link href="/catalogo" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">👁️ Ver Catálogo</Link>
            </>
          )}

          {(role === 'admin' || role === 'supervisor') && (
            <>
              <Link href="/admin" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">📈 Métricas y KPIs</Link>
              <Link href="/admin/talentos" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">✨ Gestión de Talentos</Link>
              <Link href="/admin/finanzas" className="block p-3 rounded-xl hover:bg-zinc-800 transition text-zinc-300 hover:text-white">💰 Finanzas / Transacciones</Link>
            </>
          )}
        </nav>
      </div>

      <div className="pt-6 border-t border-zinc-800">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full text-left p-3 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition font-semibold"
        >
          Cerrar Sesión ➔
        </button>
      </div>
    </aside>
  )
}