/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora errores de TypeScript en la compilación
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Evita que Webpack intente resolver módulos nativos de Node en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        module: false,
        perf_hooks: false,
        v8: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;