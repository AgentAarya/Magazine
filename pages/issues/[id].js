import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import Layout from '@/components/Layout';
import RatingStars from '@/components/RatingStars';
import Comments from '@/components/Comments';

const PDFReader = dynamic(() => import('@/components/PDFReader'), {
  ssr: false,
  loading: () => <p className="text-sm text-white/70">Loading reader...</p>
});

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function IssuePage({ id }) {
  const { data, mutate } = useSWR(id ? `/api/issues/${id}` : null, fetcher);
  const issue = data?.issue;
  const settings = data?.settings || {};
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  if (!issue) return <Layout logoUrl={settings.logo_url}>Loading...</Layout>;

  const submitRating = async () => {
    await fetch(`/api/issues/${id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating })
    });
    mutate();
  };

  const submitComment = async (event) => {
    event.preventDefault();
    await fetch(`/api/issues/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content: comment })
    });
    setName('');
    setComment('');
    mutate();
  };

  return (
    <Layout logoUrl={settings.logo_url}>
      <article className="space-y-6">
        <header className="card p-5">
          <h1 className="font-editorial text-4xl">{issue.title}</h1>
          <p className="mt-2 text-white/80">{issue.description}</p>
          <p className="mt-3 text-sm">Average rating: {Number(issue.avg_rating || 0).toFixed(1)} / 5</p>
          <div className="mt-3 flex flex-wrap gap-2">{(issue.tags || []).map((tag) => <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs">#{tag}</span>)}</div>
          <div className="mt-4 flex gap-2">
            <a className="btn-primary" href={issue.pdf_url} download>
              Download
            </a>
            <button className="btn-secondary" onClick={() => navigator.share?.({ title: issue.title, url: window.location.href })}>
              Share
            </button>
          </div>
        </header>

        <PDFReader fileUrl={issue.pdf_url} />

        <section className="card p-5">
          <h2 className="font-editorial text-2xl">Rate this issue</h2>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars value={rating} onChange={setRating} />
            <button className="btn-primary" onClick={submitRating} disabled={!rating}>
              Submit Rating
            </button>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-editorial text-2xl">Comments</h2>
          <form className="mt-3 space-y-3" onSubmit={submitComment}>
            <input className="w-full rounded border border-white/20 bg-black/30 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required maxLength={60} />
            <textarea className="w-full rounded border border-white/20 bg-black/30 px-3 py-2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment..." required maxLength={500} rows={4} />
            <button className="btn-primary" type="submit">
              Post Comment
            </button>
          </form>
          <div className="mt-5">
            <Comments comments={issue.comments || []} />
          </div>
        </section>
      </article>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return { props: { id: context.params.id } };
}
