import { isAdminRequest } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase is not configured.' });

  const logo_url = req.body.logo_url || null;
  const banner_url = req.body.banner_url || null;
  const { data: current } = await supabaseAdmin.from('site_settings').select('id').limit(1).maybeSingle();

  const operation = current
    ? supabaseAdmin.from('site_settings').update({ logo_url, banner_url }).eq('id', current.id)
    : supabaseAdmin.from('site_settings').insert({ logo_url, banner_url });

  const { error } = await operation;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
