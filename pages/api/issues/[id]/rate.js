import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase is not configured.' });

  const issueId = req.query.id;
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
  const fingerprint = crypto.createHash('sha256').update(ip + (req.headers['user-agent'] || '')).digest('hex');

  const { error } = await supabaseAdmin.from('ratings').upsert({ issue_id: issueId, voter_hash: fingerprint, rating }, { onConflict: 'issue_id,voter_hash' });
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true });
}
