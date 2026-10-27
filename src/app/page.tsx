import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import StarRating from '@/components/StarRating';

export default async function HomeCatalogPage() {
  const { data: artistas, error } = await supabase
    .from('artistas')
    .select('id, nombre, slug, foto_portada, biografia, puntuacion')
    .order('puntuacion', { ascending: false });

  if (error) {
    console.error('Error cargando el catálogo de talentos:', error);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="bg-red-950/40 border border-red-600/50 p-4 rounded-lg mb-8 text-center text-sm text-red-200">
        ⚠️ **Aviso Legal:** Contenido exclusivo para adultos (+18). Al navegar en este sitio, confirmas ser mayor de edad.
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Catálogo de Talentos Exclusivos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {artistas && artistas.length > 0 ? (
          artistas.map((artista) => (
            <div key={artista.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-zinc-700 transition flex flex-col justify-between">
              <div>
                <div className="h-64 bg-zinc-800 relative">
                  <img 
                    src={artista.foto_portada || '/placeholder.jpg'} 
                    alt={artista.nombre} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-800 shadow-md">
                    <StarRating rating={artista.puntuacion || 5.0} />
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{artista.nombre}</h2>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{artista.biografia}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link 
                  href={`/artistas/${artista.slug}`} 
                  className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Ver Perfil y Packs
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-zinc-500 py-12">No hay talentos registradas en este momento.</p>
        )}
      </div>
    </main>
  );
}
