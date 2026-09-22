import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works on GitHub Pages at /<repo-name>/ without extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
})
