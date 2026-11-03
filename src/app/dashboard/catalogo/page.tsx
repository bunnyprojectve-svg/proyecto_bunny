import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import StarRating from '@/components/StarRating';
//import SidebarNav from '@/components/SidebarNav'; // Menú lateral vertical izquierdo

export default async function CatalogPage() {
  // Consultar la lista de artistas ordenada por puntuación
  const { data: artistas, error } = await supabase
    .from('artistas')
    .select('id, nombre, slug, foto_portada, biografia, puntuacion')
    .order('puntuacion', { ascending: false });

  if (error) {
    console.error('Error cargando el catálogo:', error);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      
     

      {/* Contenido Principal del Catálogo */}
      <main className="flex-1 p-4 sm:p-8">
        
        {/* Banner Superior Prediseñado */}
        <div className="w-full bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border border-red-600/40 p-4 rounded-2xl mb-8 shadow-2xl flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-red-500 tracking-wider">BUNNY - Catálogo Exclusivo</h1>
          <span className="text-xs text-red-200 bg-red-950/80 px-3 py-1 rounded-full border border-red-600/50">
            ⚠️ Zona +18 Verificada
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-6">Talentos Disponibles</h2>

        {/* Grid de Artistas Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                    <h3 className="text-xl font-semibold mb-2">{artista.nombre}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{artista.biografia}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link 
                    href={`/artistas/${artista.slug}`} 
                    className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-medium transition text-sm"
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
    </div>
  );
}