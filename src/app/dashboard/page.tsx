'use client'

export default function UserDashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-bold mb-1">Mi Panel de Usuario</h1>
          <p className="text-zinc-400 text-sm">Gestiona tus puntos acumulados, bandejas de mensajes y packs adquiridos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase">Puntos Acumulados</h3>
            <p className="text-3xl font-black text-yellow-400 mt-2">350 Pts</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase">Packs Activos (30 Días)</h3>
            <p className="text-3xl font-black text-white mt-2">2 Packs</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase">Mensajes del Sistema</h3>
            <p className="text-3xl font-black text-red-500 mt-2">0 Alertas</p>
          </div>
        </div>
      </div>
    </main>
  );
}
