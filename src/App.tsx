import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Navigation } from '@/components/Navigation'

// Lazy load page components
const SchemaGeneratorPage = lazy(() => import('@/pages/SchemaGeneratorPage').then(m => ({ default: m.SchemaGeneratorPage })))
const LegalPageGeneratorPage = lazy(() => import('@/pages/LegalPageGeneratorPage').then(m => ({ default: m.LegalPageGeneratorPage })))
const ImageOptimizerPage = lazy(() => import('@/pages/ImageOptimizerPage').then(m => ({ default: m.ImageOptimizerPage })))

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to="/schema-generator" replace />} />
              <Route path="/schema-generator" element={<SchemaGeneratorPage />} />
              <Route path="/legal-page-generator" element={<LegalPageGeneratorPage />} />
              <Route path="/image-optimizer" element={<ImageOptimizerPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Toaster />
    </Router>
  )
}

export default App