import { isAdminRequest } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizePlainText } from '@/lib/validation';

function parseTags(tags = '') {
  if (Array.isArray(tags)) return tags;
  return tags
    .split(',')
    .map((item) => sanitizePlainText(item))
    .filter(Boolean);
}

export default async function handler(req, res) {
  if (!isAdminRequest(req)) {
    if (req.method === 'GET') return res.status(200).json({ unauthorized: true });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase is not configured.' });

  if (req.method === 'GET') {
    const { data: issues, error } = await supabaseAdmin.from('issues').select('*').order('issue_date', { ascending: false });
    const { data: settings } = await supabaseAdmin.from('site_settings').select('*').limit(1).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ issues, settings: settings || {} });
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const payload = {
      title: sanitizePlainText(req.body.title).slice(0, 180),
      issue_date: req.body.issue_date,
      description: sanitizePlainText(req.body.description).slice(0, 1000),
      tags: parseTags(req.body.tags),
      featured: Boolean(req.body.featured),
      pdf_url: req.body.pdf_url,
      thumbnail_url: req.body.thumbnail_url || null
    };

    if (!payload.title || !payload.issue_date || !payload.description || !payload.pdf_url) {
      return res.status(400).json({ error: 'Missing required issue fields.' });
    }

    const query =
      req.method === 'POST'
        ? supabaseAdmin.from('issues').insert(payload)
        : supabaseAdmin.from('issues').update(payload).eq('id', req.body.id);

    const { error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('issues').delete().eq('id', req.query.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
