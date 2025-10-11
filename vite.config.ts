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
    host: true,
    hmr: {
      overlay: true
    }
  },
  esbuild: {
    charset: 'utf8'
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