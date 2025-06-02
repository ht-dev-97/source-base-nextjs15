import { COOKIE_KEYS } from '@/constants'

import { getCookie, removeCookie, setCookie } from './cookies-client'

export const setAuthToken = (token: string, expires?: number): void => {
  setCookie(COOKIE_KEYS.AUTH_TOKEN, token, {
    expires: expires ? new Date(Date.now() + expires * 1000) : undefined,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

export const getAuthToken = (): string | null => {
  return getCookie(COOKIE_KEYS.AUTH_TOKEN)
}

export const removeAuthToken = (): void => {
  removeCookie(COOKIE_KEYS.AUTH_TOKEN)
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
