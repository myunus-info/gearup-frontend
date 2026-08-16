const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, BACKEND_API_URL } = process.env;

export const env = {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  BACKEND_API_URL,
} as const;
