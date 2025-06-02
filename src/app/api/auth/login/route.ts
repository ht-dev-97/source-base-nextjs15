import { COOKIE_KEYS } from '@/constants'
import { getSecureTokenOptions } from '@/utils'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing username or password' },
        { status: 400 }
      )
    }

    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    })

    const refreshToken = jwt.sign(
      { username },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({ success: true }, { status: 200 })

    // Set HTTP-only cookies with the tokens
    const accessTokenOptions = getSecureTokenOptions('access')
    const refreshTokenOptions = getSecureTokenOptions('refresh')

    response.cookies.set({
      name: COOKIE_KEYS.AUTH_TOKEN,
      value: accessToken,
      ...accessTokenOptions
    })

    response.cookies.set({
      name: COOKIE_KEYS.REFRESH_TOKEN,
      value: refreshToken,
      ...refreshTokenOptions
    })

    // Set non-HTTP-only token version for client-side auth check
    response.cookies.set({
      name: COOKIE_KEYS.TOKEN_VERSION,
      value: Date.now().toString(),
      httpOnly: false,
      secure: accessTokenOptions.secure,
      sameSite: accessTokenOptions.sameSite
    })

    return response
  } catch (error) {
    console.error('Login error:', error)

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
