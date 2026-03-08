import { supabaseAdmin } from '@/lib/supabase';
import { sanitizePlainText } from '@/lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase is not configured.' });

  const issueId = req.query.id;
  const name = sanitizePlainText(req.body.name).slice(0, 60);
  const content = sanitizePlainText(req.body.content).slice(0, 500);

  if (!name || !content) return res.status(400).json({ error: 'Name and comment are required.' });

  const { error } = await supabaseAdmin.from('comments').insert({ issue_id: issueId, name, content });
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true });
}
