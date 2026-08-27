import type { NextConfig } from "next";
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  openNextConfig: defineCloudflareConfig({
    incrementalCache: "kv-incremental-cache",
    tagCache: "do-sharded-tag-cache",
  }),
  // Excluir archivos de next/dist/compiled que el tracing copia de forma conservadora
  // pero que no se usan en runtime (verificado: ninguno es importado por el código de la app).
  // Reduce el bundle del Worker ~1.8MB gzip para entrar en el límite de 3MiB del plan free.
  outputFileTracingExcludes: {
    '*': [
      'node_modules/next/dist/compiled/next-devtools/**',
      'node_modules/next/dist/compiled/@next/font/dist/fontkit/**',
      'node_modules/next/dist/compiled/next-server/app-page-experimental.runtime.prod.js',
      'node_modules/next/dist/compiled/next-server/app-page-turbo-experimental.runtime.prod.js',
      'node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js',
      'node_modules/next/dist/compiled/next-server/pages-turbo.runtime.prod.js',
      'node_modules/next/dist/compiled/edge-runtime/**',
      'node_modules/next/dist/compiled/@edge-runtime/**',
      'node_modules/next/dist/compiled/crypto-browserify/**',
      'node_modules/next/dist/compiled/@vercel/nft/**',
      'node_modules/next/dist/compiled/cssnano-simple/**',
      'node_modules/next/dist/compiled/compression/**',
      'node_modules/next/dist/compiled/comment-json/**',
      'node_modules/next/dist/compiled/conf/**',
      'node_modules/next/dist/compiled/jsonwebtoken/**',
      'node_modules/react-dom/cjs/react-dom-server.edge.development.js',
      'node_modules/react-dom/cjs/react-dom-server.browser.development.js',
      'node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js',
      'node_modules/react-dom/cjs/react-dom-server-legacy.node.development.js',
      'node_modules/react-dom/cjs/react-dom-server.node.development.js',
    ],
  },
  // Optimizaciones de rendimiento
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fkfoapcvmuxycebsnttd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  generateEtags: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
