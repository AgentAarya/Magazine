import { formatDistanceToNow } from 'date-fns';

export default function Comments({ comments }) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article key={comment.id} className="card p-3">
          <p className="font-semibold">{comment.name}</p>
          <p className="mt-1 text-white/90">{comment.content}</p>
          <p className="mt-2 text-xs text-white/60">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
        </article>
      ))}
      {!comments.length ? <p className="text-sm text-white/70">No comments yet.</p> : null}
    </div>
  );
}
