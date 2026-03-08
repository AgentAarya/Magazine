import { useMemo, useState } from 'react';
import useSWR from 'swr';
import Layout from '@/components/Layout';
import IssueCard from '@/components/IssueCard';
import SearchBar from '@/components/SearchBar';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const [query, setQuery] = useState('');
  const { data } = useSWR('/api/issues?sort=desc', fetcher);
  const issues = data?.issues || [];
  const settings = data?.settings || {};

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return issues.filter((issue) => {
      const haystack = `${issue.title} ${(issue.tags || []).join(' ')} ${issue.issue_date}`.toLowerCase();
      return haystack.includes(lower);
    });
  }, [issues, query]);

  const featured = filtered.filter((issue) => issue.featured).slice(0, 3);
  const latest = filtered.slice(0, 6);

  return (
    <Layout logoUrl={settings.logo_url}>
      <section className="relative mb-10 overflow-hidden rounded-xl border border-white/10">
        {settings.banner_url ? <img src={settings.banner_url} alt="The Creative Chronicles banner" className="h-64 w-full object-cover opacity-60" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent p-6">
          <h1 className="font-editorial text-4xl">A living archive of creativity.</h1>
          <p className="mt-2 max-w-2xl text-white/85">Browse, read, and discuss every issue of The Creative Chronicles in one modern digital archive.</p>
        </div>
      </section>

      <SearchBar value={query} onChange={setQuery} />

      <section className="mt-10">
        <h2 className="font-editorial text-3xl">Featured Issues</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">{featured.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>
      </section>

      <section className="mt-10">
        <h2 className="font-editorial text-3xl">Latest Issues</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">{latest.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>
      </section>
    </Layout>
  );
}
