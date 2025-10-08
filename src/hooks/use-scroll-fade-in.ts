import { useEffect, useRef, useState } from 'react'

interface UseScrollFadeInOptions {
  threshold?: number
  rootMargin?: string
}

export function useScrollFadeIn({ threshold = 0.1, rootMargin = '0px' }: UseScrollFadeInOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, stop observing to prevent re-triggering
          if (elementRef.current) {
            observer.unobserve(elementRef.current)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, rootMargin])

  return { ref: elementRef, isVisible }
}