import jwt, { type JwtPayload } from 'jsonwebtoken';

export type VerifyResult =
  | { success: true; data: JwtPayload | string }
  | { success: false; error: string };

const verifyToken = (token: string, secret: string): VerifyResult => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    return {
      success: false,
      error: message,
    };
  }
};

export const jwtUtils = {
  verifyToken,
};
