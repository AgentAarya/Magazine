import { clearAdminCookie } from '@/lib/auth';

export default function handler(_req, res) {
  res.setHeader('Set-Cookie', clearAdminCookie());
  res.status(200).json({ ok: true });
}
