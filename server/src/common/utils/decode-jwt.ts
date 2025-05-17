import { decode, JwtPayload } from 'jsonwebtoken';

export function decodeJwt(credential: string): JwtPayload | null {
  const decoded = decode(credential);
  console.log('🚀 ~ decodeJwt ~ decoded:', decoded);

  if (decoded && typeof decoded === 'object' && 'email' in decoded) {
    return decoded as JwtPayload;
  }

  return null;
}
