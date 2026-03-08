import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { randomUUID } from 'crypto';
import { isAdminRequest } from '@/lib/auth';
import { ensureImage, ensurePdf } from '@/lib/validation';
import { supabaseAdmin } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false
  }
};

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeFileName(value = 'upload') {
  return value.replace(/[^a-zA-Z0-9.\-_]/g, '');
}

async function uploadToSupabaseStorage(file, kind) {
  const original = sanitizeFileName(file.originalFilename || 'upload');
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'creative-chronicles';
  const objectPath = `${kind}/${Date.now()}-${randomUUID()}-${original}`;

  const buffer = fs.readFileSync(file.filepath);
  const { error } = await supabaseAdmin.storage.from(bucket).upload(objectPath, buffer, {
    contentType: file.mimetype || undefined,
    upsert: false
  });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

function uploadToLocal(file) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const safeName = `${Date.now()}-${sanitizeFileName(file.originalFilename || 'upload')}`;
  const destination = path.join(uploadsDir, safeName);
  fs.copyFileSync(file.filepath, destination);
  return `/uploads/${safeName}`;
}

function isValidUpload(kind, file) {
  if (kind === 'pdf') return ensurePdf(file.originalFilename || '', file.mimetype || '');
  if (kind === 'image') return ensureImage(file.originalFilename || '', file.mimetype || '');
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const form = formidable({ multiples: false, maxFileSize: 1024 * 1024 * 25 });
    const [fields, files] = await form.parse(req);
    const uploaded = first(files.file);
    const kind = first(fields.kind) || 'pdf';

    if (!uploaded) return res.status(400).json({ error: 'File is required.' });
    if (!['pdf', 'image'].includes(kind)) return res.status(400).json({ error: 'Invalid upload kind.' });

    if (!isValidUpload(kind, uploaded)) {
      return res.status(400).json({ error: kind === 'pdf' ? 'Only PDF files are allowed for issues.' : 'Only image files are allowed for branding.' });
    }

    const url = supabaseAdmin ? await uploadToSupabaseStorage(uploaded, kind) : uploadToLocal(uploaded);
    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Upload failed.' });
  }
}
