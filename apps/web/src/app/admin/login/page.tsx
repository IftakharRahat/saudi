'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const callbackUrl = '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setErrorMessage('Invalid email or password.');
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F5F7FB] px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage website content.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
