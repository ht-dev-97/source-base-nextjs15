'use client'

import { useEffect, useState, useCallback } from 'react'

export type Breakpoint =
  | 'mobile'
  | 'smallTablet'
  | 'tablet'
  | 'desktop'
  | 'largeDesktop'

export interface WindowSize {
  width: number
  height: number
  breakpoint: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const BREAKPOINTS: Record<Breakpoint, number> = {
  mobile: 639, // 0-639px
  smallTablet: 767, // 640-767px
  tablet: 1023, // 768-1023px
  desktop: 1279, // 1024-1279px
  largeDesktop: Infinity // 1280px+
} as const

/**
 * Default window dimensions for SSR
 */
const DEFAULT_DIMENSIONS = {
  width: 1024,
  height: 768
} as const

const getBreakpoint = (width: number): Breakpoint => {
  if (width <= BREAKPOINTS.mobile) {
    return 'mobile'
  }
  if (width <= BREAKPOINTS.smallTablet) {
    return 'smallTablet'
  }
  if (width <= BREAKPOINTS.tablet) {
    return 'tablet'
  }
  if (width <= BREAKPOINTS.desktop) {
    return 'desktop'
  }

  return 'largeDesktop'
}

const createWindowSize = (width: number, height: number): WindowSize => {
  const breakpoint = getBreakpoint(width)

  return {
    width,
    height,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'smallTablet' || breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'largeDesktop'
  }
}

export const useWindowSize = (): WindowSize => {
  const getInitialSize = useCallback((): WindowSize => {
    if (typeof window === 'undefined') {
      return createWindowSize(
        DEFAULT_DIMENSIONS.width,
        DEFAULT_DIMENSIONS.height
      )
    }

    return createWindowSize(window.innerWidth, window.innerHeight)
  }, [])

  const [size, setSize] = useState<WindowSize>(getInitialSize)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setSize(createWindowSize(window.innerWidth, window.innerHeight))
      }, 200) // 200ms debounce for performance
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}
