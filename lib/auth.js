import cookie from 'cookie';
import crypto from 'crypto';
import { ADMIN_COOKIE, SESSION_TTL_SECONDS } from './config';

function signature(value) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET || 'creative-chronicles-secret').update(value).digest('hex');
}

function safeEqual(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function createAdminCookie() {
  const payload = JSON.stringify({
    role: 'admin',
    iat: Date.now(),
    nonce: crypto.randomUUID()
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const signed = `${encoded}.${signature(encoded)}`;
  return cookie.serialize(ADMIN_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/'
  });
}

export function clearAdminCookie() {
  return cookie.serialize(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/'
  });
}

export function isAdminRequest(req) {
  const parsed = cookie.parse(req.headers.cookie || '');
  const token = parsed[ADMIN_COOKIE];
  if (!token) return false;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return false;
  if (!safeEqual(signature(encoded), sig)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
