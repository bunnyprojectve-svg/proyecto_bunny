// src/app/layout.tsx
import './globals.css'
import AgeVerificationModal from '@/components/AgeVerificationModal'
import AgeWarningBanner from '@/components/AgeWarningBanner'

export const metadata = {
  title: 'BUNNY - Plataforma de Contenido Exclusivo',
  description: 'Sitio web exclusivo para adultos mayores de 18 años',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-zinc-950 text-white min-h-screen antialiased flex flex-col">
        
        {/* 1. Barra de advertencia legal permanente (arriba del todo) */}
        <AgeWarningBanner />

        {/* 2. Banner Superior Prediseñado Permanente con Imagen y Nombre */}
        <header className="w-full bg-zinc-900 border-b border-zinc-800 py-3 px-6 shadow-md sticky top-[37px] z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo / Nombre de la página */}
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-black text-red-500 tracking-wider">🐰 BUNNY</span>
              <span className="hidden sm:inline-block text-xs bg-red-950/60 text-red-300 border border-red-600/40 px-2.5 py-1 rounded-full font-medium">
                Plataforma Premium (+18)
              </span>
            </div>

            {/* Espacio para imagen prediseñada de fondo o elementos globales del banner */}
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden md:inline">Sistema Operativo</span>
            </div>
          </div>
        </header>

        {/* 3. Modal de verificación de mayoría de edad obligatorio al ingresar */}
        <AgeVerificationModal />

        {/* 4. Contenedor Dinámico de las páginas y vistas de la aplicación */}
        <div className="flex-1">
          {children}
        </div>

      </body>
    </html>
  )
}