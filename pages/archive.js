import { useMemo, useState } from 'react';
import useSWR from 'swr';
import Layout from '@/components/Layout';
import IssueCard from '@/components/IssueCard';
import SearchBar from '@/components/SearchBar';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ArchivePage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('asc');
  const { data } = useSWR(`/api/issues?sort=${sort}`, fetcher);
  const issues = data?.issues || [];
  const settings = data?.settings || {};

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return issues.filter((issue) => `${issue.title} ${(issue.tags || []).join(' ')} ${issue.issue_date}`.toLowerCase().includes(lower));
  }, [issues, query]);

  return (
    <Layout logoUrl={settings.logo_url}>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="font-editorial text-4xl">Magazine Archive</h1>
        <button className="btn-secondary w-fit" onClick={() => setSort((s) => (s === 'asc' ? 'desc' : 'asc'))}>
          Sort: {sort === 'asc' ? 'Oldest → Newest' : 'Newest → Oldest'}
        </button>
      </div>

      <SearchBar value={query} onChange={setQuery} />
      <div className="mt-6 grid gap-4 md:grid-cols-3">{filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>
    </Layout>
  );
}
