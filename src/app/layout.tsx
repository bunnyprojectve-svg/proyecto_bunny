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
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <AgeWarningBanner />
        <AgeVerificationModal />
        {children}
      </body>
    </html>
  )
}
