import { COOKIE_KEYS } from '@/constants'
import { CookieOptions } from '@/types'
import Cookies from 'js-cookie'

export const setCookie = (
  name: string,
  value: string,
  options?: CookieOptions
): void => {
  Cookies.set(name, value, options)
}

export const getCookie = (name: string): string | null => {
  const value = Cookies.get(name)

  return value || null
}

export const removeCookie = (
  name: string,
  options?: Pick<CookieOptions, 'path' | 'domain'>
): void => {
  Cookies.remove(name, options)
}

export const clearAllCookies = (): void => {
  Object.values(COOKIE_KEYS).forEach((cookieName) => {
    removeCookie(cookieName)
  })
}
