/* eslint-disable @typescript-eslint/no-explicit-any */
import { COOKIE_KEYS } from '@/constants'
import { getSecureTokenOptions } from '@/utils'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

type JwtPayload = {
  username: string
  iat?: number
  exp?: number
}

export async function POST(request: NextRequest) {
  try {
    // Get the refresh token from cookies
    const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Verify the refresh token
    let payload: JwtPayload
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as JwtPayload
    } catch {
      // Invalid or expired refresh token
      const response = NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )

      // Clear all auth cookies
      response.cookies.delete(COOKIE_KEYS.AUTH_TOKEN)
      response.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN)
      response.cookies.delete(COOKIE_KEYS.TOKEN_VERSION)

      return response
    }

    // Generate new tokens
    const { username } = payload

    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    })

    // Optionally generate new refresh token for rotation
    const newRefreshToken = jwt.sign(
      { username },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    // Create the response
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Set cookies with the new tokens
    const accessTokenOptions = getSecureTokenOptions('access')
    const refreshTokenOptions = getSecureTokenOptions('refresh')

    response.cookies.set({
      name: COOKIE_KEYS.AUTH_TOKEN,
      value: accessToken,
      ...accessTokenOptions
    })

    response.cookies.set({
      name: COOKIE_KEYS.REFRESH_TOKEN,
      value: newRefreshToken,
      ...refreshTokenOptions
    })

    // Update token version
    response.cookies.set({
      name: COOKIE_KEYS.TOKEN_VERSION,
      value: Date.now().toString(),
      httpOnly: false,
      secure: accessTokenOptions.secure,
      sameSite: accessTokenOptions.sameSite as any
    })

    return response
  } catch (error) {
    console.error('Token refresh error:', error)

    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}
