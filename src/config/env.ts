const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_API_URL ||
  'https://gearup-nestjs-server.vercel.app/api/v1';

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'gearUpDefaultSecretKey12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'gearUpDefaultRefreshSecretKey12345';

export const env = {
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  BACKEND_API_URL,
} as const;
