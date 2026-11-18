import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['mailchat-mark.svg'],
      manifest: {
        name: 'MailChat',
        short_name: 'MailChat',
        description: 'Mail conversations that feel like chat.',
        theme_color: '#166534',
        background_color: '#f6faf7',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/mailchat-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
})
