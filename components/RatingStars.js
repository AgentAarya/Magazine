export default function RatingStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className={`text-2xl ${value >= star ? 'text-yellow-400' : 'text-white/40'}`}>
          ★
        </button>
      ))}
    </div>
  );
}
