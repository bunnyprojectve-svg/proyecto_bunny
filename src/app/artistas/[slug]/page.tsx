import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArtistaPerfilPage({ params }: Props) {
  // En las versiones recientes de Next.js, params es una promesa y debe resolverse con await
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Consultar los datos del artista usando el slug de la URL
  const { data: artista, error } = await supabase
    .from('artistas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !artista) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="text-zinc-400 hover:text-white mb-6 inline-block text-sm transition"
        >
          ← Volver al Catálogo
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
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

            <h2 className="text-xl font-semibold mb-4 text-zinc-300">Packs Disponibles</h2>
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center">
              <p className="text-zinc-400 mb-4">Inicia sesión o suscríbete para acceder al contenido exclusivo de {artista.nombre}.</p>
              <button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2.5 rounded-lg transition">
                Desbloquear Suscripción
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}