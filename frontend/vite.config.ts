// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Configuración de Vite
// ===================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Puerto del servidor de desarrollo
  server: {
    port: 5173,
    strictPort: true, // Falla si el puerto está ocupado
    host: true, // Escuchar en todas las interfaces

    // Proxy para comunicación con el backend .NET
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false, // Permitir certificados auto-firmados
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },

  // Aliases para imports más limpios
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@services': path.resolve(__dirname, './src/services'),
      '@tema': path.resolve(__dirname, './src/tema'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },

  // Configuración de build para producción
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-charts': ['echarts', 'echarts-for-react'],
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers']
        }
      }
    }
  },

  // Variables de entorno
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://localhost:5001'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify('IMPERHA NÓMINAS'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0')
  }
});
