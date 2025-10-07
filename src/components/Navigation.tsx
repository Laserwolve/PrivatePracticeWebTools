import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/hooks/use-theme'
import { FileCode, Scale, Image, Mail } from 'lucide-react'

export function Navigation() {
  const location = useLocation()
  const { theme } = useTheme()

  const navItems = [
    { path: '/schema-generator', label: 'Schema Generator', icon: FileCode },
    { path: '/legal-page-generator', label: 'Legal Page Generator', icon: Scale },
    { path: '/image-optimizer', label: 'Image Optimizer', icon: Image },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Link to="/schema-generator">
              <img 
                src={theme === 'dark' ? "/images/logoDark.webp" : "/images/logo.webp"}
                alt="Private Practice Web Tools" 
                className="h-10 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('mailto:contact@example.com', '_blank')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}