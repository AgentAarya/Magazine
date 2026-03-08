import Link from 'next/link';
import { format } from 'date-fns';

export default function IssueCard({ issue }) {
  return (
    <article className="card p-4">
      {issue.thumbnail_url ? <img src={issue.thumbnail_url} alt={issue.title} className="mb-3 h-48 w-full rounded-md object-cover" /> : null}
      <h3 className="font-editorial text-xl">{issue.title}</h3>
      <p className="mt-1 text-sm text-white/70">{format(new Date(issue.issue_date), 'PPP')}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(issue.tags || []).map((tag) => (
          <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs">
            #{tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/80">Rating: {Number(issue.avg_rating || 0).toFixed(1)} / 5</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/issues/${issue.id}`} className="btn-primary">
          Read
        </Link>
        <a href={issue.pdf_url} className="btn-secondary" download>
          Download
        </a>
      </div>
    </article>
  );
}
