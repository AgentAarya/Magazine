import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

const emptyIssue = {
  title: '',
  issue_date: '',
  description: '',
  tags: '',
  featured: false,
  pdf_url: '',
  thumbnail_url: ''
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data, mutate } = useSWR('/api/admin/issues', fetcher);
  const [issueForm, setIssueForm] = useState(emptyIssue);
  const [editingId, setEditingId] = useState(null);
  const [settings, setSettings] = useState({ logo_url: '', banner_url: '' });

  useEffect(() => {
    if (data?.unauthorized) router.push('/admin/login');
    if (data?.settings) setSettings(data.settings);
  }, [data, router]);

  const uploadAsset = async (file, kind) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', kind);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const payload = await response.json();
    return payload.url;
  };

  const saveIssue = async (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    await fetch('/api/admin/issues', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...issueForm, id: editingId })
    });
    setIssueForm(emptyIssue);
    setEditingId(null);
    mutate();
  };

  const deleteIssue = async (id) => {
    await fetch(`/api/admin/issues?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const saveSiteAssets = async (event) => {
    event.preventDefault();
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    mutate();
  };

  if (!data) return <main className="p-8">Loading...</main>;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4">
      <header className="flex items-center justify-between">
        <h1 className="font-editorial text-4xl">Admin Dashboard</h1>
        <button
          className="btn-secondary"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
          }}
        >
          Logout
        </button>
      </header>

      <section className="card p-5">
        <h2 className="font-editorial text-2xl">Website Branding</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={saveSiteAssets}>
          <div>
            <label className="mb-2 block text-sm">Logo URL</label>
            <input value={settings.logo_url || ''} onChange={(e) => setSettings((s) => ({ ...s, logo_url: e.target.value }))} className="w-full rounded border border-white/20 bg-black/20 px-3 py-2" />
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                const url = await uploadAsset(e.target.files[0], 'image');
                setSettings((s) => ({ ...s, logo_url: url }));
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Banner URL</label>
            <input value={settings.banner_url || ''} onChange={(e) => setSettings((s) => ({ ...s, banner_url: e.target.value }))} className="w-full rounded border border-white/20 bg-black/20 px-3 py-2" />
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                const url = await uploadAsset(e.target.files[0], 'image');
                setSettings((s) => ({ ...s, banner_url: url }));
              }}
            />
          </div>
          <button className="btn-primary w-fit" type="submit">
            Save Branding
          </button>
        </form>
      </section>

      <section className="card p-5">
        <h2 className="font-editorial text-2xl">{editingId ? 'Edit Issue' : 'Upload Issue'}</h2>
        <form onSubmit={saveIssue} className="mt-4 grid gap-3">
          <input placeholder="Issue title" className="rounded border border-white/20 bg-black/20 px-3 py-2" value={issueForm.title} onChange={(e) => setIssueForm((s) => ({ ...s, title: e.target.value }))} required />
          <input type="date" className="rounded border border-white/20 bg-black/20 px-3 py-2" value={issueForm.issue_date} onChange={(e) => setIssueForm((s) => ({ ...s, issue_date: e.target.value }))} required />
          <textarea placeholder="Description" className="rounded border border-white/20 bg-black/20 px-3 py-2" value={issueForm.description} onChange={(e) => setIssueForm((s) => ({ ...s, description: e.target.value }))} rows={3} required />
          <input placeholder="Tags (comma separated)" className="rounded border border-white/20 bg-black/20 px-3 py-2" value={issueForm.tags} onChange={(e) => setIssueForm((s) => ({ ...s, tags: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={issueForm.featured} onChange={(e) => setIssueForm((s) => ({ ...s, featured: e.target.checked }))} /> Featured issue
          </label>
          <div>
            <label className="mb-2 block text-sm">PDF URL</label>
            <input placeholder="PDF URL" className="w-full rounded border border-white/20 bg-black/20 px-3 py-2" value={issueForm.pdf_url} onChange={(e) => setIssueForm((s) => ({ ...s, pdf_url: e.target.value }))} required />
            <input
              type="file"
              accept="application/pdf"
              className="mt-2"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                const url = await uploadAsset(e.target.files[0], 'pdf');
                setIssueForm((s) => ({ ...s, pdf_url: url }));
              }}
            />
          </div>
          <input placeholder="Thumbnail URL (optional)" className="rounded border border-white/20 bg-black/20 px-3 py-2" value={issueForm.thumbnail_url} onChange={(e) => setIssueForm((s) => ({ ...s, thumbnail_url: e.target.value }))} />
          <button className="btn-primary w-fit" type="submit">
            {editingId ? 'Update Issue' : 'Create Issue'}
          </button>
        </form>
      </section>

      <section className="card p-5">
        <h2 className="font-editorial text-2xl">Manage Issues</h2>
        <div className="mt-4 space-y-3">
          {(data.issues || []).map((issue) => (
            <div key={issue.id} className="flex flex-col justify-between gap-3 rounded border border-white/10 p-3 md:flex-row md:items-center">
              <div>
                <p className="font-semibold">{issue.title}</p>
                <p className="text-sm text-white/70">{issue.issue_date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEditingId(issue.id);
                    setIssueForm({
                      title: issue.title,
                      issue_date: issue.issue_date,
                      description: issue.description,
                      tags: (issue.tags || []).join(','),
                      featured: issue.featured,
                      pdf_url: issue.pdf_url,
                      thumbnail_url: issue.thumbnail_url || ''
                    });
                  }}
                >
                  Edit
                </button>
                <button className="btn-primary bg-red-800 hover:bg-red-900" onClick={() => deleteIssue(issue.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
