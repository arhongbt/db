'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { DoveLogo } from '@/components/ui/DoveLogo';
// Decorations removed — caused z-index/visibility bugs on mobile

type AuthTab = 'login' | 'register' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { t } = useLanguage();
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
      const errorMessage = err instanceof Error ? err.message : t('Något gick fel. Försök igen.', 'Something went wrong. Try again.');
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
      setError(t('Lösenorden matchar inte.', 'Passwords do not match.'));
      return;
    }

    if (password.length < 6) {
      setError(t('Lösenordet måste vara minst 6 tecken.', 'Password must be at least 6 characters.'));
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(t('Kolla din e-post för bekräftelse!', 'Check your email for confirmation!'));
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('Något gick fel. Försök igen.', 'Something went wrong. Try again.');
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
      setSuccess(t('Länk för återställning skickad. Kolla din e-post.', 'Reset link sent. Check your email.'));
      setEmail('');
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('Något gick fel. Försök igen.', 'Something went wrong. Try again.');
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
          <p className="text-muted text-sm">{t('Vi finns här för dig', 'We are here for you')}</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 bg-white rounded-full p-1 shadow-sm">
          <button
            onClick={() => {
              setTab('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-full transition-all font-semibold text-sm ${
              tab === 'login'
                ? 'text-white'
                : 'text-primary hover:bg-primary-lighter'
            }`}
            style={tab === 'login' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : undefined}
          >
            {t('Logga in', 'Sign in')}
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-full transition-all font-semibold text-sm ${
              tab === 'register'
                ? 'text-white'
                : 'text-primary hover:bg-primary-lighter'
            }`}
            style={tab === 'register' ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : undefined}
          >
            {t('Skapa konto', 'Create account')}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div role="alert" className="mb-4 p-4 text-warn text-sm animate-slideUp" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(196,149,106,0.06), rgba(196,149,106,0.02))', border: '1px solid rgba(196,149,106,0.15)' }}>
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div role="status" className="mb-4 p-4 text-success text-sm animate-slideUp" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
            {success}
          </div>
        )}

        {/* Login form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="animate-fadeIn">
            <div className="card space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-primary mb-1.5">
                  {t('E-postadress', 'Email address')}
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('din@email.se', 'your@email.com')}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-primary mb-1.5">
                  {t('Lösenord', 'Password')}
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? t('Loggar in...', 'Signing in...') : t('Logga in', 'Sign in')}
              </button>

              <button
                type="button"
                onClick={() => setTab('reset')}
                className="w-full py-2 text-accent hover:text-primary text-sm font-medium transition-colors"
              >
                {t('Glömt lösenord?', 'Forgot password?')}
              </button>
            </div>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="animate-fadeIn">
            <div className="card space-y-4">
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-primary mb-1.5">
                  {t('E-postadress', 'Email address')}
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('din@email.se', 'your@email.com')}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-primary mb-1.5">
                  {t('Lösenord', 'Password')}
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background"
                />
                <p className="text-xs text-muted mt-1.5">{t('Minst 6 tecken', 'At least 6 characters')}</p>
              </div>

              <div>
                <label htmlFor="register-confirm" className="block text-sm font-medium text-primary mb-1.5">
                  {t('Bekräfta lösenord', 'Confirm password')}
                </label>
                <input
                  id="register-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? t('Skapar konto...', 'Creating account...') : t('Skapa konto', 'Create account')}
              </button>
            </div>
          </form>
        )}

        {/* Password reset form */}
        {tab === 'reset' && (
          <form onSubmit={handleResetPassword} className="animate-fadeIn">
            <div className="mb-4 p-4 text-accent text-sm" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
              {t('Vi skickar en säker länk till din e-postadress där du kan återställa ditt lösenord.', 'We will send a secure link to your email where you can reset your password.')}
            </div>

            <div className="card space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-primary mb-1.5">
                  {t('E-postadress', 'Email address')}
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('din@email.se', 'your@email.com')}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? t('Skickar...', 'Sending...') : t('Skicka återställningslänk', 'Send reset link')}
              </button>

              <button
                type="button"
                onClick={() => setTab('login')}
                className="w-full py-2 text-accent hover:text-primary text-sm font-medium transition-colors"
              >
                {t('Tillbaka till logga in', 'Back to sign in')}
              </button>
            </div>
          </form>
        )}
        {/* Footer links */}
        <div className="flex justify-center gap-4 mt-8 text-xs text-muted">
          <Link href="/om" className="hover:text-accent transition-colors">{t('Om oss', 'About')}</Link>
          <Link href="/integritetspolicy" className="hover:text-accent transition-colors">{t('Integritetspolicy', 'Privacy Policy')}</Link>
          <Link href="/anvandarvillkor" className="hover:text-accent transition-colors">{t('Villkor', 'Terms')}</Link>
        </div>
      </div>
    </div>
  );
}
