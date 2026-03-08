import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req, res) {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase is not configured.' });

  const { id } = req.query;
  const { data: issue, error } = await supabaseAdmin.from('issues_with_rating').select('*').eq('id', id).single();
  const { data: comments } = await supabaseAdmin.from('comments').select('*').eq('issue_id', id).order('created_at', { ascending: false });
  const { data: settings } = await supabaseAdmin.from('site_settings').select('*').limit(1).maybeSingle();

  if (error) return res.status(404).json({ error: error.message });
  return res.status(200).json({ issue: { ...issue, comments: comments || [] }, settings: settings || {} });
}
