'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArtistaPerfilPage({ params }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [artista, setArtista] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [packSeleccionado, setPackSeleccionado] = useState<any>(null);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (resolvedParams?.slug) {
      obtenerArtistaYContenido(resolvedParams.slug);
    }
  }, [resolvedParams]);

  async function obtenerArtistaYContenido(slugArtista: string) {
    try {
      setLoading(true);

      // 1. Obtener la información de la artista desde Supabase
      const { data: artistaData, error: artistaError } = await supabase
        .from('artistas')
        .select('*')
        .eq('slug', slugArtista)
        .single();

      if (artistaError || !artistaData) {
        console.error('Error al obtener artista:', artistaError);
        setLoading(false);
        return;
      }

      setArtista(artistaData);

      // 2. Registrar la visita al perfil (opcional según tu tabla perfil_visitas)
      await supabase.from('perfil_visitas').insert({
        artista_slug: slugArtista,
      });

      // 3. Obtener los packs disponibles creados por el administrador (limitado entre 4 y 8)
      const { data: packsData, error: packsError } = await supabase
        .from('packs')
        .select('*')
        .limit(8);

      if (!packsError && packsData) {
        setPacks(packsData);
      }

    } catch (err) {
      console.error('Error general al cargar el perfil:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">
        Cargando perfil exclusivo...
      </div>
    );
  }

  if (!artista) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Artista no encontrada</h1>
        <Link href="/catalogo" className="text-red-500 hover:underline text-sm">
          ← Volver al catálogo de talentos
        </Link>
      </div>
    );
  }

  // Fotos de galería (hasta 4 adicionales)
  const galeriaFotos: string[] = artista.fotos_galeria || [];
  // Video incrustado de Bunny Stream (almacenado en la columna video_destacado o similar)
  const videoBunnyUrl: string = artista.video_destacado || '';

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-16">
      
      {/* 1. Foto de Portada Obligatoria */}
      <div className="w-full h-72 sm:h-96 relative bg-zinc-900 border-b border-zinc-800 overflow-hidden">
        <img
          src={artista.foto_portada || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200'}
          alt={artista.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-20 relative z-10 space-y-10">
        
        {/* Cabecera de Información de la Artista */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 bg-zinc-900/90 backdrop-blur border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
          <div className="flex items-end gap-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-zinc-950 bg-zinc-800 shadow-xl shrink-0">
              <img
                src={artista.foto_portada || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={artista.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="bg-red-950 text-red-400 border border-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Creadora Verificada 🐰
              </span>
              <h1 className="text-3xl sm:text-4xl font-black mt-2">{artista.nombre}</h1>
              <p className="text-zinc-400 text-sm mt-1">@{artista.slug}</p>
            </div>
          </div>

          <Link
            href="/catalogo"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2.5 rounded-xl text-xs font-bold transition border border-zinc-700"
          >
            ← Volver al Catálogo
          </Link>
        </div>

        {/* Biografía */}
        {artista.biografia && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-red-500">Sobre mí</h2>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{artista.biografia}</p>
          </div>
        )}

        {/* 2. Video Destacado desde Bunny Stream */}
        {videoBunnyUrl && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold">🎬 Video Exclusivo (Bunny Stream)</h2>
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-inner flex items-center justify-center">
              <iframe
                src={videoBunnyUrl}
                loading="lazy"
                className="w-full h-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 3. Galería de Fotos (Hasta 4 fotos adicionales de Bunny Stream / Almacenamiento) */}
        {galeriaFotos.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold">📸 Galería de Fotos ({galeriaFotos.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galeriaFotos.slice(0, 4).map((fotoUrl, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-square relative shadow-md">
                  <img src={fotoUrl} alt={`Galería ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Packs Disponibles creados por el Administrador (Entre 4 y 8) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black">Packs Exclusivos Disponibles</h2>
              <p className="text-zinc-400 text-xs mt-1">Selecciona un pack para ver su contenido y adquirirlo.</p>
            </div>
          </div>

          {packs.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center text-zinc-500">
              No hay packs disponibles en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <div key={pack.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-0.5 rounded">
                        {pack.incluye_videollamada ? '🎥 Incluye Videollamada' : '📦 Exclusivo'}
                      </span>
                      <span className="text-lg font-black text-emerald-400">${pack.precio} USD</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{pack.titulo}</h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-3">{pack.descripcion}</p>
                  </div>

                  <button
                    onClick={() => {
                      setPackSeleccionado(pack);
                      setMostrarModalPago(true);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-lg shadow-red-900/30"
                  >
                    Adquirir Pack 💳
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal de Simulación / Procesamiento de Pago */}
      {mostrarModalPago && packSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <h3 className="text-xl font-bold">Adquirir: {packSeleccionado.titulo}</h3>
            <p className="text-xs text-zinc-400">Total a pagar: <strong className="text-emerald-400">${packSeleccionado.precio} USD</strong></p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  alert('¡Compra simulada con éxito! Revisa tu panel de usuario para acceder al contenido.');
                  setMostrarModalPago(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                Confirmar Pago VIP
              </button>
              <button
                onClick={() => setMostrarModalPago(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl transition text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}