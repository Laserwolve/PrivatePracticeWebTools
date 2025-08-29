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
    emptyOutDir: true,
    chunkSizeWarningLimit: 700, // Increase limit to 700KB since syntax-highlighter is unavoidably large
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core dependencies
          'react-vendor': ['react', 'react-dom'],
          
          // UI library chunks
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          
          // Animation and visualization
          'animation': ['framer-motion'],
          'charts': ['recharts', 'd3'],
          
          // Form and utilities
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'icons': ['lucide-react', '@heroicons/react'],
          'utils': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'date-fns',
            'uuid',
            'marked'
          ],
          
          // Large individual libraries
          'syntax-highlighter': ['react-syntax-highlighter'],
          'carousel': ['embla-carousel-react'],
          'query': ['@tanstack/react-query']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
