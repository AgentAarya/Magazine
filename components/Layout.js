import Link from 'next/link';

export default function Layout({ children, logoUrl }) {
  return (
    <div className="min-h-full">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            {logoUrl ? <img src={logoUrl} alt="The Creative Chronicles logo" className="h-10 w-10 rounded-full object-cover" /> : null}
            <span className="font-editorial text-2xl">The Creative Chronicles</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/archive" className="hover:text-red-400">
              Archive
            </Link>
            <Link href="/admin/login" className="hover:text-red-400">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
