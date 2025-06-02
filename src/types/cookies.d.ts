export type TokenType = 'access' | 'refresh'

export type CookieOptions = {
  expires?: Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}
