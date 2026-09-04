import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // User site (breeganzo.github.io) serves from the domain root, so no base prefix.
  base: '/',
  plugins: [react(), tailwindcss()],
})
