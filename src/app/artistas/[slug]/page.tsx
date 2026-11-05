'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

interface MetodoPago {
  id: string;
  tipo: string;
  alias: string;
  detalles: any;
}

export default function ArtistaPerfilPage({ params }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [artista, setArtista] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal de Pago Dinámico (Momento 2)
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [packSeleccionado, setPackSeleccionado] = useState<any>(null);
  const [pasarelasActivas, setPasarelasActivas] = useState<MetodoPago[]>([]);
  const [pasarelaSeleccionada, setPasarelaSeleccionada] = useState<MetodoPago | null>(null);
  const [hashTransaccion, setHashTransaccion] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (resolvedParams?.slug) {
      obtenerArtistaYContenido(resolvedParams.slug);
      obtenerPasarelasActivas();
    }
  }, [resolvedParams]);

  async function obtenerArtistaYContenido(slugArtista: string) {
    try {
      setLoading(true);

      // 1. Obtener datos de la artista
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

      // 2. Registrar visita (Manejo defensivo por si la tabla no existe o falla)
      await supabase.from('perfil_visitas').insert({
        artista_slug: slugArtista,
      }).catch(() => {});

      // 3. Obtener EXCLUSIVAMENTE los packs asociados a esta artista usando su ID
      const { data: packsData, error: packsError } = await supabase
        .from('packs')
        .select('*')
        .eq('artista_id', artistaData.id);

      console.log("Artista actual ID:", artistaData.id);
      console.log("Packs encontrados:", packsData);
      console.log("Error de packs:", packsError);

      if (!packsError && packsData) {
        setPacks(packsData);
      }

    } catch (err) {
      console.error('Error general al cargar el perfil:', err);
    } finally {
      setLoading(false);
    }
  }

  async function obtenerPasarelasActivas() {
    try {
      const { data, error } = await supabase
        .from('configuracion_pagos')
        .select('*')
        .eq('activa', true);

      if (!error && data) {
        setPasarelasActivas(data);
        if (data.length > 0) setPasarelaSeleccionada(data[0]);
      }
    } catch (err) {
      console.error('Error al obtener pasarelas:', err);
    }
  }

  // Lógica para packs con costo (> 0)
  const handleConfirmarCompraPack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashTransaccion.trim() || !packSeleccionado) return;

    setProcesandoPago(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Debes iniciar sesión para adquirir un pack.');
        return;
      }

      const { error } = await supabase
        .from('compras_packs')
        .insert({
          usuario_id: user.id,
          pack_id: packSeleccionado.id,
          pasarela_pago: pasarelaSeleccionada?.tipo || 'binance_pay',
          id_transaccion_ext: hashTransaccion.trim(),
          monto_pagado: packSeleccionado.precio,
        });

      if (error) throw error;

      alert('¡Compra registrada con éxito! El pack ha sido habilitado en tu cuenta.');
      setMostrarModalPago(false);
      setHashTransaccion('');
    } catch (err: any) {
      alert('Error al procesar la compra: ' + err.message);
    } finally {
      setProcesandoPago(false);
    }
  };

  // Lógica para el botón Adquirir (Diferenciando Precio 0 vs Pago)
  const handleBotonAdquirir = async (pack: any) => {
    const precioNumerico = Number(pack.precio);

    if (precioNumerico === 0) {
      // Reclamar pack gratuito
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('Debes iniciar sesión para obtener este pack gratuito.');
          return;
        }

        const { error } = await supabase
          .from('compras_packs')
          .insert({
            usuario_id: user.id,
            pack_id: pack.id,
            pasarela_pago: 'gratis',
            id_transaccion_ext: 'FREE-' + Date.now(),
            monto_pagado: 0,
          });

        if (error) throw error;

        alert('¡Pack gratuito reclamado con éxito! Revisa tu biblioteca.');
      } catch (err: any) {
        alert('Error al reclamar el pack: ' + err.message);
      }
    } else {
      // Abrir modal de pago para packs con costo
      setPackSeleccionado(pack);
      setMostrarModalPago(true);
    }
  };

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

  const galeriaFotos: string[] = artista.fotos_galeria || [];
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

        {/* 3. Galería de Fotos */}
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

        {/* 4. Packs Exclusivos de la Artista */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black">Packs Exclusivos Disponibles</h2>
              <p className="text-zinc-400 text-xs mt-1">Selecciona un pack para ver su contenido y adquirirlo.</p>
            </div>
          </div>

          {packs.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center text-zinc-500">
              No hay packs disponibles para esta artista en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => {
                const esGratis = Number(pack.precio) === 0;
                return (
                  <div key={pack.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-0.5 rounded">
                          {pack.incluye_videollamada ? '🎥 Incluye Videollamada' : '📦 Exclusivo'}
                        </span>
                        <span className={`text-lg font-black ${esGratis ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          {esGratis ? 'GRATIS 🎉' : `$${pack.precio} USD`}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{pack.titulo}</h3>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-3">{pack.descripcion}</p>
                    </div>

                    <button
                      onClick={() => handleBotonAdquirir(pack)}
                      className={`w-full font-bold py-3 rounded-xl transition text-xs shadow-lg cursor-pointer ${
                        esGratis
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-yellow-900/20'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30'
                      }`}
                    >
                      {esGratis ? 'Obtener Gratis 🎉' : 'Adquirir Pack 💳'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Modal de Pago Dinámico para Packs (>0 USD) */}
      {mostrarModalPago && packSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full uppercase font-bold">
                Checkout de Pack
              </span>
              <h3 className="text-xl font-bold mt-2">{packSeleccionado.titulo}</h3>
              <p className="text-xs text-zinc-400 mt-1">Total a pagar: <strong className="text-emerald-400">${packSeleccionado.precio} USD</strong></p>
            </div>

            {pasarelasActivas.length === 0 ? (
              <div className="bg-red-950/60 border border-red-600/50 p-4 rounded-2xl text-center text-xs text-red-200">
                ⚠️ Actualmente no hay pasarelas de pago activas. Por favor, intente de nuevo más tarde.
              </div>
            ) : (
              <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Pasarela Disponible:</label>
                <div className="flex gap-2">
                  {pasarelasActivas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPasarelaSeleccionada(p)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition border ${pasarelaSeleccionada?.id === p.id ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
                    >
                      {p.tipo.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {pasarelaSeleccionada?.tipo === 'binance_pay' && (
                  <div className="space-y-1 pt-2 border-t border-zinc-800 text-xs">
                    <span className="text-zinc-400">Cuenta de destino ({pasarelaSeleccionada.alias}):</span>
                    <div className="font-mono text-yellow-400 font-bold">{pasarelaSeleccionada.detalles?.identifier}</div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleConfirmarCompraPack} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  ID de Transacción / Hash *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 82374910293847"
                  value={hashTransaccion}
                  onChange={(e) => setHashTransaccion(e.target.value)}
                  disabled={pasarelasActivas.length === 0}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 font-mono disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={procesandoPago || pasarelasActivas.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
                >
                  {procesandoPago ? 'Registrando...' : 'Confirmar Pago del Pack'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalPago(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}