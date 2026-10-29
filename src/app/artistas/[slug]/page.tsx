'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArtistaPerfilPage({ params }: Props) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [artista, setArtista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    async function obtenerArtistaYRegistrarVisita() {
      // 1. Obtener la información de la artista
      const { data, error } = await supabase
        .from('artistas')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setArtista(data);

        // 2. Registrar el evento de tráfico en la tabla perfil_visitas
        const { data: authData } = await supabase.auth.getUser();
        await supabase.from('perfil_visitas').insert([
          {
            artista_slug: slug,
            usuario_id: authData?.user?.id || null, // NULL si es un visitante no autenticado
          },
        ]);
      }
      setLoading(false);
    }

    if (slug) {
      obtenerArtistaYRegistrarVisita();
    }
  }, [slug]);

  // Manejador del flujo de pago según la pasarela elegida
  const handleProcesarPago = () => {
    if (!metodoSeleccionado || !artista) return;

    if (metodoSeleccionado === 'ccbill') {
      // Configuración de FlexForm de CCBill
      const clientAccnum = "900000";  // Tu número de cuenta CCBill
      const clientSubacc = "0000";    // Tu subcuenta CCBill
      const formName = "70cc";        // ID de tu FlexForm

      const ccbillUrl = new URL(`https://bill.ccbill.com/jpost/signup.cgi`);
      ccbillUrl.searchParams.append('clientAccnum', clientAccnum);
      ccbillUrl.searchParams.append('clientSubacc', clientSubacc);
      ccbillUrl.searchParams.append('formName', formName);
      ccbillUrl.searchParams.append('customUserSlug', artista.slug);

      // Redirigir al formulario seguro de pago de CCBill
      window.location.href = ccbillUrl.toString();
    } else if (metodoSeleccionado === 'binance') {
      alert(`Iniciando checkout con BinancePay para ${artista.nombre}...`);
    } else if (metodoSeleccionado === 'nowpayments') {
      alert(`Iniciando checkout con NOWPayments para ${artista.nombre}...`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Cargando perfil...</p>
      </main>
    );
  }

  if (!artista) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Artista no encontrada</h1>
        <Link href="/" className="text-rose-500 hover:underline">
          ← Volver al Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 relative">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="text-zinc-400 hover:text-white mb-6 inline-block text-sm transition"
        >
          ← Volver al Catálogo
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Foto Principal / Portada */}
          <div className="h-80 bg-zinc-800 relative">
            <img 
              src={artista.foto_portada || '/placeholder.jpg'} 
              alt={artista.nombre} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold mb-2">{artista.nombre}</h1>
            <p className="text-rose-500 font-medium mb-4">Puntuación: ⭐ {artista.puntuacion || '5.0'}</p>
            
            <h2 className="text-xl font-semibold mb-2 text-zinc-300">Biografía</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              {artista.biografia || 'Sin biografía disponible.'}
            </p>

            {/* Galería de Fotos Adicionales */}
            {artista.fotos_galeria && artista.fotos_galeria.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-zinc-300">Galería Destacada</h2>
                <div className="grid grid-cols-3 gap-3">
                  {artista.fotos_galeria.map((fotoUrl: string, idx: number) => (
                    <div key={idx} className="h-36 sm:h-48 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-800">
                      <img 
                        src={fotoUrl} 
                        alt={`Galería ${idx + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sección de Packs Disponibles */}
            <h2 className="text-xl font-semibold mb-4 text-zinc-300">Packs Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-1 rounded-full uppercase font-bold tracking-wide">
                    VIP Pass
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-1">Pack Exclusivo Fotos & Videos</h3>
                  <p className="text-zinc-400 text-sm mb-4">Acceso ilimitado al contenido multimedia del mes.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-800">
                  <span className="text-xl font-bold text-white">$19.99 / mes</span>
                  <button 
                    onClick={() => setMostrarModalPago(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                  >
                    Desbloquear
                  </button>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between opacity-90">
                <div>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full uppercase font-bold tracking-wide">
                    Premium
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-1">Suscripción Anual</h3>
                  <p className="text-zinc-400 text-sm mb-4">Acceso total a todos los lanzamientos por 12 meses.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-800">
                  <span className="text-xl font-bold text-white">$149.99 / año</span>
                  <button 
                    onClick={() => setMostrarModalPago(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                  >
                    Desbloquear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VENTANA MODAL DE PASARELA DE PAGO */}
      {mostrarModalPago && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                setMostrarModalPago(false);
                setMetodoSeleccionado(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-2 text-center">Pasarela de Pago</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">
              Selecciona tu método preferido para desbloquear el contenido de <strong className="text-white">{artista.nombre}</strong>.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setMetodoSeleccionado('ccbill')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                  metodoSeleccionado === 'ccbill' 
                    ? 'border-rose-500 bg-rose-500/10 text-white' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-rose-500 font-bold text-lg">💳</span>
                  <span className="font-medium">Tarjeta de Crédito (CCBill)</span>
                </div>
                {metodoSeleccionado === 'ccbill' && <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded font-bold">Seleccionado</span>}
              </button>

              <button
                onClick={() => setMetodoSeleccionado('binance')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                  metodoSeleccionado === 'binance' 
                    ? 'border-yellow-500 bg-yellow-500/10 text-white' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-500 font-bold text-lg">🟡</span>
                  <span className="font-medium">BinancePay (Cripto)</span>
                </div>
                {metodoSeleccionado === 'binance' && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">Seleccionado</span>}
              </button>

              <button
                onClick={() => setMetodoSeleccionado('nowpayments')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                  metodoSeleccionado === 'nowpayments' 
                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                    : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-bold text-lg">🔷</span>
                  <span className="font-medium">NOWPayments (USDT/BTC)</span>
                </div>
                {metodoSeleccionado === 'nowpayments' && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold">Seleccionado</span>}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMostrarModalPago(false);
                  setMetodoSeleccionado(null);
                }}
                className="w-1/2 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-medium transition"
              >
                Cancelar
              </button>

              <button
                disabled={!metodoSeleccionado}
                onClick={handleProcesarPago}
                className="w-1/2 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-semibold transition"
              >
                Pagar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}