'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TalentDashboardPage() {
  // Datos simulados de la artista y sus 5 fotos permitidas
  const [artistaInfo, setArtistaInfo] = useState({
    nombre: 'Camila Torres',
    slug: 'camila-torres',
    biografia: 'Creadora de contenido exclusivo y packs multimedia.',
    fotoPortada: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
    fotosGaleria: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60',
      '',
      '',
    ],
    visitasTotales: 4230,
    packsVendidos: 145,
    gananciasTotales: 3850.00,
  });

  const [packsArtista] = useState([
    { id: 1, titulo: 'Pack Exclusivo Fotos & Videos - Octubre', precio: 19.99, estado: 'Activo', ventas: 95 },
    { id: 2, titulo: 'Suscripción Anual VIP', precio: 149.99, estado: 'Activo', ventas: 50 },
  ]);

  const handleGuardarCambios = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Información y galería actualizadas exitosamente en Supabase!');
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-rose-500/50 bg-zinc-800">
              <img src={artistaInfo.fotoPortada} alt={artistaInfo.nombre} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Panel de Artista
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight mt-1">Bienvenida, {artistaInfo.nombre}</h1>
            </div>
          </div>

          <Link
            href={`/artistas/${artistaInfo.slug}`}
            target="_blank"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Ver mi Perfil Público ↗
          </Link>
        </div>

        {/* 1. Tarjetas de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Visitas en tu Perfil</p>
            <h3 className="text-3xl font-black text-white">👁️ {artistaInfo.visitasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Tráfico registrado en tu ruta pública</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Packs Vendidos</p>
            <h3 className="text-3xl font-black text-white">📦 {artistaInfo.packsVendidos}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Total de ventas registradas</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Tus Ganancias Netas</p>
            <h3 className="text-3xl font-black text-emerald-400">${artistaInfo.gananciasTotales.toLocaleString()}</h3>
            <span className="text-xs text-zinc-500 mt-2 block">Acumulado según pasarelas de pago</span>
          </div>
        </div>

        {/* 2. Sección Principal: Gestión de Perfil (Fotos y Biografía) + Packs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de Gestión de Perfil y las 5 Fotos */}
          <form onSubmit={handleGuardarCambios} className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Tu Perfil Público</h2>
              <p className="text-zinc-400 text-xs mb-6">Actualiza tus datos y tus hasta 5 fotos visibles en tu catálogo.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Nombre Artístico</label>
                  <input 
                    type="text" 
                    defaultValue={artistaInfo.nombre}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Biografía</label>
                  <textarea 
                    rows={3}
                    defaultValue={artistaInfo.biografia}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">1. Foto de Portada (Obligatoria)</label>
                  <input 
                    type="text" 
                    defaultValue={artistaInfo.fotoPortada}
                    placeholder="URL de la foto principal"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Fotos de Galería (Hasta 4 Opcionales)</label>
                  <div className="space-y-2">
                    {artistaInfo.fotosGaleria.map((foto, idx) => (
                      <input 
                        key={idx}
                        type="text" 
                        defaultValue={foto}
                        placeholder={`URL Foto opcional ${idx + 1}`}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-6 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-lg shadow-rose-600/20">
              Guardar Cambios de Perfil
            </button>
          </form>

          {/* Listado de Packs (Información de lo que ofrece) */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Tus Packs Multimedia</h2>
                  <p className="text-zinc-400 text-xs mt-1">Los videos y contenido pesado de estos packs son configurados por el equipo de desarrollo mediante Bunny Stream.</p>
                </div>
              </div>

              <div className="space-y-4">
                {packsArtista.map((pack) => (
                  <div key={pack.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          {pack.estado}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">Ventas: {pack.ventas}</span>
                      </div>
                      <h3 className="font-bold text-base">{pack.titulo}</h3>
                      <span className="text-rose-400 font-bold text-sm">${pack.precio} USD</span>
                    </div>

                    <div className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg">
                      🎥 Gestionado vía Bunny Stream
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
              <p className="text-xs text-zinc-400">
                ¿Necesitas agregar un nuevo pack multimedia o actualizar videos en alta definición? <br />
                <span className="text-rose-400 font-medium">Contacta al Administrador / Desarrollador de la plataforma.</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}