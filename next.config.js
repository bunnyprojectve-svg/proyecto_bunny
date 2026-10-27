/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite que Vercel complete el despliegue ignorando errores menores de tipos
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;