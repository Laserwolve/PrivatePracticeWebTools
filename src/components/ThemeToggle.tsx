import React from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <MoonIcon className="h-4 w-4 transition-all" />
        ) : (
          <SunIcon className="h-4 w-4 transition-all" />
        )}
      </Button>
      <span className="text-xs text-muted-foreground">
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </div>
  )
}
