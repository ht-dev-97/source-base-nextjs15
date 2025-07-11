export const env = {
  API_BASE_URL: process.env.API_BASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development'
}
