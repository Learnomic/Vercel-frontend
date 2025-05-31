import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
  
    tailwindcss(),
    react()],
  build: {
    chunkSizeWarningLimit: 600, // Increase the chunk size warning limit to 1000 kB
  }
})
