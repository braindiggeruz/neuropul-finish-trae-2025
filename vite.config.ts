import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Neuropul AI',
        short_name: 'Neuropul',
        description: 'AI-powered personal growth assistant',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 минут
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                // Добавляем версионный префикс для runtime-кэша
                const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
                return `${request.url}?version=${version}`;
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
              }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              }
            }
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        injectionPoint: 'self.__SW_MANIFEST = (self.__SW_MANIFEST || [])'
      }
    }),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/',
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 300,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        dead_code: true
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      treeshake: true,
      input: {
        main: './index.html'
      },
      output: {

        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React ecosystem - keep core small
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router')) return 'react-core';
            if (id.includes('react-router')) return 'react-router';
            
            // Heavy animation libraries - lazy load
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('animejs') || id.includes('lottie')) return 'animation';
            
            // PDF and canvas - lazy load
            if (id.includes('pdf-lib') || id.includes('html2canvas') || id.includes('jspdf')) return 'pdf';
            
            // Backend services - separate chunks
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            if (id.includes('@supabase/auth')) return 'supabase-auth';
            if (id.includes('@supabase/storage')) return 'supabase-storage';
            
            // UI libraries
            if (id.includes('lucide') || id.includes('heroicons') || id.includes('tabler')) return 'icons';
            
            // Utilities - split by size
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('date-fns') || id.includes('dayjs')) return 'date-utils';
            if (id.includes('uuid') || id.includes('nanoid')) return 'id-utils';
            
            // Crypto and security
            if (id.includes('crypto-js') || id.includes('bcrypt')) return 'crypto';
            
            // Small vendor libs
            return 'vendor';
          }
           
           // App-specific chunking - more granular
          if (id.includes('src/services/')) {
            if (id.includes('aiService') || id.includes('traeService')) return 'ai-services';
            if (id.includes('paymentService') || id.includes('premiumService')) return 'payment-services';
            return 'services';
          }
          if (id.includes('src/components/dashboard')) return 'dashboard';
          if (id.includes('src/components/premium') || id.includes('src/components/payment')) return 'premium';
          if (id.includes('src/components/effects') || id.includes('src/components/animations')) return 'effects';
          if (id.includes('src/utils/')) {
            if (id.includes('pdfGenerator')) return 'pdf-utils';
            return 'app-utils';
          }
          if (id.includes('src/constants') || id.includes('src/data')) return 'constants';
        },
        experimentalMinChunkSize: 20000
      }
    },
  },
  define: {
    global: 'globalThis',
  }
})