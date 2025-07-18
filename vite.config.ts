import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss(),],
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      treeshake: false, // <-- helps expose the actual file causing it
    },
  },
})
