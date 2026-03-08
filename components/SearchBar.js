export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by title, tags, or date (YYYY-MM-DD)..."
      className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-red-500 focus:outline-none"
    />
  );
}
