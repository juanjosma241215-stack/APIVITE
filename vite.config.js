import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt', 'SENA-LOGO.png', 'pwa-192x192.png'],
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ['**/*.{js,css,html,png,svg,jsx}'], 
      },
      manifest: {
        name: 'My App PWA',
        short_name: 'MyApp',
        description: 'Una super app con Vite y React',
        start_url: '/',
        scope: '/',
        display: 'standalone', 
        background_color: '#ffffff',
        theme_color: '#000000',
        screenshots: [{
          src: '/img/logo.jpg',
          sizes: '640x480',
          type: 'image/jpeg',
          form_factor: 'narrow',
          
        }],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'sena-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
