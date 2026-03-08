import { ADMIN_PASSWORD } from '@/lib/config';
import { createAdminCookie } from '@/lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const password = req.body.password || '';
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' });

  res.setHeader('Set-Cookie', createAdminCookie());
  return res.status(200).json({ ok: true });
}
