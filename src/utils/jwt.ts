import jwt, { SignOptions } from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JwtPayload = Record<string, any>

export const generateJwt = (
  payload: JwtPayload,
  options: SignOptions = { expiresIn: '1h' }
): string => {
  const signOptions: SignOptions = { expiresIn: '1h', ...options }

  return jwt.sign(payload, process.env.JWT_SECRET!, signOptions)
}

export const verifyJwt = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)

    return null
  }
}
