export function sanitizePlainText(value = '') {
  return value
    .toString()
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

export function ensurePdf(fileName = '', mimeType = '') {
  const lower = fileName.toLowerCase();
  return lower.endsWith('.pdf') && mimeType === 'application/pdf';
}

export function ensureImage(fileName = '', mimeType = '') {
  const lower = fileName.toLowerCase();
  const validExtension = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].some((ext) => lower.endsWith(ext));
  return validExtension && mimeType.startsWith('image/');
}
