import { COOKIE_KEYS } from '@/constants'
import { NextResponse } from 'next/server'

export async function POST() {
  // Create the response
  const response = NextResponse.json({ success: true }, { status: 200 })

  // Clear all auth cookies
  response.cookies.delete(COOKIE_KEYS.AUTH_TOKEN)
  response.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN)
  response.cookies.delete(COOKIE_KEYS.TOKEN_VERSION)

  return response
}
