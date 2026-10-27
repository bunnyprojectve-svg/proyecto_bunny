import { getServiceSupabase } from '@/lib/supabaseClient';

export default async function AdminDashboardPage() {
  const supabase = getServiceSupabase();

  const { count: totalUsuarios } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalVentas } = await supabase.from('compras_packs').select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Panel Administrativo y de Analítica</h1>
        <p className="text-zinc-400 text-sm">Monitoreo en tiempo real de accesos, tiempos de uso, conversiones y ventas por talento.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Usuarios Registrados</h3>
          <p className="text-3xl font-black mt-2 text-white">{totalUsuarios ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Packs Totales Vendidos</h3>
          <p className="text-3xl font-black mt-2 text-red-500">{totalVentas ?? 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Estado del Sistema</h3>
          <p className="text-emerald-400 font-bold mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Operativo (Vercel / Supabase)
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-3">Auditoría y Registro de Transacciones</h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Desde este módulo los administradores y desarrolladores gestionan la distribución de ingresos (70% para los talentos y 30% para gastos administrativos del sistema), la configuración de precios y la programación de transmisiones en vivo.
        </p>
      </div>
    </div>
  );
}
