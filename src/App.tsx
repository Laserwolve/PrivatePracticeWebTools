import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { SchemaGenerator } from '@/components/SchemaGenerator'
import { LegalPageGenerator } from '@/components/LegalPageGenerator'
import { ImageOptimizer } from '@/components/ImageOptimizer'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/hooks/use-theme'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCode, Scale, Image, Mail } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('schema')
  const { theme } = useTheme()

  const tools = [
    {
      id: 'schema',
      title: 'Schema Generator',
      description: 'Add the required data below to generate Schema Markup for your webpages',
      component: SchemaGenerator,
      icon: FileCode
    },
    {
      id: 'legal',
      title: 'Legal Page Generator',
      description: 'Generate legal pages for your website',
      component: LegalPageGenerator,
      icon: Scale
    },
    {
      id: 'images',
      title: 'Image Optimizer (coming soon!)',
      description: 'Optimize images for better website performance',
      component: ImageOptimizer,
      icon: Image
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="relative text-center mb-12">
          <div className="absolute top-0 right-0 flex flex-col gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-auto px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <a 
                href="mailto:Andrew@CounselingWise.com?subject=Private%20Practice%20Web%20Tools%20Support"
                className="flex items-center gap-2"
                onClick={() => {
                  console.log('Support button clicked!');
                  // Fallback: copy email to clipboard if mailto doesn't work
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText('Andrew@CounselingWise.com');
                    alert('Email address copied to clipboard: Andrew@CounselingWise.com');
                  }
                }}
              >
                <Mail className="h-3 w-3" />
                Support
              </a>
            </Button>
          </div>
          <img 
            src={theme === 'dark' ? "/images/logoDark.webp" : "/images/logo.webp"}
            alt="Private Practice Web Tools" 
            className="mx-auto mb-4 h-16 w-auto"
          />
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto bg-muted">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex flex-col gap-2 p-4 h-auto transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <IconComponent className="w-5 h-5 mx-auto" />
                  <span className="text-xs font-medium">
                    {tool.title}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                  scale: { duration: 0.2 },
                }}
              >
                {(() => {
                  const tool = tools.find(t => t.id === activeTab)
                  if (!tool) return null
                  
                  const Component = tool.component
                  return (
                    <Card className="shadow-lg border border-border bg-card text-card-foreground">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <CardHeader>
                          <CardTitle className="text-card-foreground">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">{tool.description}</CardDescription>
                        </CardHeader>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <CardContent>
                          <Component />
                        </CardContent>
                      </motion.div>
                    </Card>
                  )
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}

export default App