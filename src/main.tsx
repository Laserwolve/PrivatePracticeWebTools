import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/hooks/use-theme'

import "./main.css"

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
)
