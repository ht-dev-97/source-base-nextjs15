'use client'

import { useEffect, useState } from 'react'

export type BreakpointName =
  | 'mobile' // < 640px
  | 'tablet-sm' // 640px <= w < 768px
  | 'tablet-lg' // 768px <= w < 1024px
  | 'desktop' // >= 1024px
  | 'lg' // >= 1280px
  | 'xl' // >= 1536px

export const BREAKPOINTS: Record<BreakpointName, string> = {
  mobile: '(max-width: 639px)',
  'tablet-sm': '(min-width: 640px) and (max-width: 767px)',
  'tablet-lg': '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  lg: '(min-width: 1280px)',
  xl: '(min-width: 1536px)'
}

export function useMediaQuery(query: BreakpointName): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = BREAKPOINTS[query]
    const media = window.matchMedia(mediaQuery)

    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)

    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}
