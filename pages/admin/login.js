import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      setError('Invalid password.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black p-4">
      <form className="card w-full max-w-md p-6" onSubmit={submit}>
        <h1 className="font-editorial text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-white/80">Enter the admin password to manage The Creative Chronicles.</p>
        <input type="password" className="mt-4 w-full rounded border border-white/20 bg-black/30 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <button className="btn-primary mt-4 w-full" type="submit">
          Login
        </button>
      </form>
    </main>
  );
}
