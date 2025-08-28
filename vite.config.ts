import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

const projectRoot = process.env.PROJECT_ROOT || fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
