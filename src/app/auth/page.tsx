'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import Link from 'next/link';
import { DoveLogo } from '@/components/ui/DoveLogo';

type AuthTab = 'login' | 'register' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [tab, setTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Något gick fel. Försök igen.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess('Kolla din e-post för bekräftelse!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Något gick fel. Försök igen.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Länk för återställning skickad. Kolla din e-post.');
      setEmail('');
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Något gick fel. Försök igen.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        {/* Header with logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <DoveLogo size={48} />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Sista Resan</h1>
          <p className="text-muted text-sm">Vi finns här för dig</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-card p-1 shadow-sm">
          <button
            onClick={() => {
              setTab('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-3 rounded transition-all font-semibold text-sm ${
              tab === 'login'
                ? 'bg-primary text-white'
                : 'text-primary hover:bg-primary-lighter'
            }`}
          >
            Logga in
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-3 rounded transition-all font-semibold text-sm ${
              tab === 'register'
                ? 'bg-primary text-white'
                : 'text-primary hover:bg-primary-lighter'
            }`}
          >
            Skapa konto
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div role="alert" className="mb-4 p-4 bg-[#FEF3EE] border-l-4 border-warn rounded-r-card text-warn text-sm animate-slideUp">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div role="status" className="mb-4 p-4 bg-accent/5 border-l-4 border-success rounded-r-card text-success text-sm animate-slideUp">
            {success}
          </div>
        )}

        {/* Login form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
            <div className="card">
              <label htmlFor="login-email" className="block text-sm font-medium text-primary mb-2">
                E-postadress
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-card text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <div className="card">
              <label htmlFor="login-password" className="block text-sm font-medium text-primary mb-2">
                Lösenord
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-card text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </button>

            <button
              type="button"
              onClick={() => setTab('reset')}
              className="w-full py-2 text-accent hover:text-primary text-sm font-medium transition-colors"
            >
              Glömt lösenord?
            </button>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 animate-fadeIn">
            <div className="card">
              <label htmlFor="register-email" className="block text-sm font-medium text-primary mb-2">
                E-postadress
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-card text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <div className="card">
              <label htmlFor="register-password" className="block text-sm font-medium text-primary mb-2">
                Lösenord
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-card text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              <p className="text-xs text-muted mt-2">Minst 6 tecken</p>
            </div>

            <div className="card">
              <label htmlFor="register-confirm" className="block text-sm font-medium text-primary mb-2">
                Bekräfta lösenord
              </label>
              <input
                id="register-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-card text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Skapar konto...' : 'Skapa konto'}
            </button>
          </form>
        )}

        {/* Password reset form */}
        {tab === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4 animate-fadeIn">
            <div className="info-box mb-4">
              Vi skickar en säker länk till din e-postadress där du kan återställa ditt lösenord.
            </div>

            <div className="card">
              <label htmlFor="reset-email" className="block text-sm font-medium text-primary mb-2">
                E-postadress
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-card text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Skickar...' : 'Skicka återställningslänk'}
            </button>

            <button
              type="button"
              onClick={() => setTab('login')}
              className="w-full py-2 text-accent hover:text-primary text-sm font-medium transition-colors"
            >
              Tillbaka till logga in
            </button>
          </form>
        )}
        {/* Footer links */}
        <div className="flex justify-center gap-4 mt-8 text-xs text-muted">
          <Link href="/om" className="hover:text-accent transition-colors">Om oss</Link>
          <Link href="/integritetspolicy" className="hover:text-accent transition-colors">Integritetspolicy</Link>
          <Link href="/anvandarvillkor" className="hover:text-accent transition-colors">Villkor</Link>
        </div>
      </div>
    </div>
  );
}
