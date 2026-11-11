'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function UserDashboardPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerMisPacks();
  }, []);

  async function obtenerMisPacks() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Consultar las compras del usuario y traer la información de los packs y su contenido
      const { data, error } = await supabase
        .from('compras_packs')
        .select(`
          id,
          fecha_expiracion,
          packs (
            id,
            titulo,
            descripcion,
            precio,
            artistas (nombre, slug)
          )
        `)
        .eq('usuario_id', user.id);

      if (!error && data) {
        setCompras(data);
      }
    } catch (err) {
      console.error('Error al cargar la biblioteca:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">
        Cargando tu biblioteca exclusiva...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 w-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera del Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Biblioteca Personal 🐰
            </span>
            <h1 className="text-2xl font-bold mt-2">Mis Packs Exclusivos Adquiridos</h1>
            <p className="text-zinc-400 text-xs mt-1">Aquí puedes visualizar todo el contenido multimedia desbloqueado por 30 días.</p>
          </div>
          <Link
            href="/catalogo"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg"
          >
            ← Volver al Catálogo
          </Link>
        </div>

        {/* Listado de Compras / Packs Activos */}
        {compras.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-2xl text-center space-y-4">
            <p className="text-zinc-400 text-sm">Aún no has adquirido ningún pack exclusivo.</p>
            <Link
              href="/catalogo"
              className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl text-xs font-bold transition border border-zinc-700"
            >
              Explorar Artistas y Packs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compras.map((compra) => {
              const pack = compra.packs;
              if (!pack) return null;

              return (
                <div key={compra.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-0.5 rounded">
                        Creadora: {pack.artistas?.nombre || 'Artista'}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Expira: {new Date(compra.fecha_expiracion).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mt-1">{pack.titulo}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{pack.descripcion}</p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                      <p className="text-xs text-emerald-400 font-semibold">✓ Contenido Desbloqueado y Activo</p>
                    </div>

                    {/* Enlace corregido apuntando al id de la compra */}
                    <Link
                      href={`/perfil/compras/${compra.id}`}
                      className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-xs text-center shadow-lg cursor-pointer"
                    >
                      Ver Contenido del Pack 🔓
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}