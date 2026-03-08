import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req, res) {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase is not configured.' });

  const sort = req.query.sort === 'desc' ? 'desc' : 'asc';
  const { data: issues, error } = await supabaseAdmin
    .from('issues_with_rating')
    .select('*')
    .order('issue_date', { ascending: sort === 'asc' });

  const { data: settings } = await supabaseAdmin.from('site_settings').select('*').limit(1).maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ issues, settings: settings || {} });
}
