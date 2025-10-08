import React from 'react'
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in'

interface ScrollFadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollFadeIn({ children, className = '', delay = 0 }: ScrollFadeInProps) {
  const { ref, isVisible } = useScrollFadeIn()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}