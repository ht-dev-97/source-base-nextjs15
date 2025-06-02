import { COOKIE_KEYS } from '@/constants'
import { CookieOptions, TokenType } from '@/types'
import { cookies } from 'next/headers'

export const getSecureTokenOptions = (type: TokenType): CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production'
  const isSecure =
    isProd || process.env.NEXT_PUBLIC_USE_SECURE_COOKIES === 'true'

  // Base options
  const options: CookieOptions = {
    secure: isSecure,
    httpOnly: true,
    path: '/',
    sameSite: isProd ? 'strict' : 'lax'
  }

  // Token specific options
  if (type === 'access') {
    options.maxAge = 15 * 60 // 15 minutes in seconds
  } else if (type === 'refresh') {
    options.maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
    options.path = '/api/auth' // Restrict refresh token to auth endpoints
  }

  return options
}

/**
 * Set a cookie on the server side with the given name, value and options
 */
export const setServerCookie = async (
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> => {
  ;(await cookies()).set({
    name,
    value,
    ...options
  })
}

/**
 * Get a cookie from the server
 */
export const getServerCookie = async (name: string): Promise<string | null> => {
  const cookie = (await cookies()).get(name)

  return cookie?.value || null
}

/**
 * Delete a cookie on the server side
 */
export const deleteServerCookie = async (
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): Promise<void> => {
  ;(await cookies()).delete({
    name,
    ...options
  })
}

/**
 * Check if a cookie exists on the server
 */
export const hasServerCookie = async (name: string): Promise<boolean> => {
  return (await cookies()).has(name)
}

/**
 * Get all cookies from the server
 */
export const getAllServerCookies = async () => {
  return (await cookies()).getAll()
}

/**
 * Set authentication tokens on server side (HTTP-only for security)
 */
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
  options: {
    accessTokenOptions?: CookieOptions
    refreshTokenOptions?: CookieOptions
  } = {}
): void => {
  // Set the access token with default security options
  setServerCookie(COOKIE_KEYS.AUTH_TOKEN, accessToken, {
    ...getSecureTokenOptions('access'),
    ...options.accessTokenOptions
  })

  // Set the refresh token with default security options
  setServerCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
    ...getSecureTokenOptions('refresh'),
    ...options.refreshTokenOptions
  })

  // Set token version for additional security
  const tokenVersion = Date.now().toString()
  setServerCookie(COOKIE_KEYS.TOKEN_VERSION, tokenVersion, {
    httpOnly: false,
    secure: getSecureTokenOptions('access').secure,
    sameSite: getSecureTokenOptions('access').sameSite
  })
}

/**
 * Get authentication tokens from server
 */
export const getAuthTokensFromServer = async () => {
  return {
    accessToken: await getServerCookie(COOKIE_KEYS.AUTH_TOKEN),
    refreshToken: await getServerCookie(COOKIE_KEYS.REFRESH_TOKEN),
    tokenVersion: await getServerCookie(COOKIE_KEYS.TOKEN_VERSION)
  }
}

/**
 * Clear authentication tokens from server
 */
export const clearAuthTokens = (): void => {
  deleteServerCookie(COOKIE_KEYS.AUTH_TOKEN, { path: '/' })
  deleteServerCookie(COOKIE_KEYS.REFRESH_TOKEN, { path: '/api/auth' })
  deleteServerCookie(COOKIE_KEYS.TOKEN_VERSION, { path: '/' })
}

/**
 * Check if user is authenticated on server-side
 */
export const isServerAuthenticated = async (): Promise<boolean> => {
  const { accessToken, refreshToken } = await getAuthTokensFromServer()

  return !!accessToken || !!refreshToken
}

/**
 * Handle token refresh flow in server components
 * Returns true if refresh was successful
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  const { accessToken, refreshToken } = await getAuthTokensFromServer()

  if (!accessToken && refreshToken) {
    try {
      // Make a request to your refresh token API route
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        // Refresh failed, clear tokens
        clearAuthTokens()

        return false
      }

      // Refresh was successful, cookies should be set by the API route
      return true
    } catch (error) {
      console.error('Error refreshing token:', error)
      clearAuthTokens()

      return false
    }
  }

  return !!accessToken
}
