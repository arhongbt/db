'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { acceptInvite, getInviteByToken } from '@/lib/supabase/services/invite-service';
import { useAuth } from '@/lib/auth/context';
import { CheckCircle2, AlertTriangle, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const token = params.token as string;

  const [status, setStatus] = useState<'loading' | 'found' | 'accepting' | 'accepted' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [dodsboId, setDodsboId] = useState<string | null>(null);

  // Check invite validity
  useEffect(() => {
    async function checkInvite() {
      const { data, error } = await getInviteByToken(token);
      if (error || !data) {
        setStatus('error');
        setErrorMsg('Inbjudan hittades inte, har redan använts, eller har återkallats.');
        return;
      }
      setDodsboId(data.dodsbo_id);
      setStatus('found');
    }
    if (token) checkInvite();
  }, [token]);

  // Auto-accept if logged in
  const handleAccept = async () => {
    if (!user) {
      // Redirect to auth with return URL
      router.push(`/auth?redirect=/invite/${token}`);
      return;
    }

    setStatus('accepting');
    const { success, error } = await acceptInvite(token);

    if (success) {
      setStatus('accepted');
    } else {
      setStatus('error');
      setErrorMsg(error?.message || 'Något gick fel');
    }
  };

  if (authLoading || status === 'loading') {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm">Laddar inbjudan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-5">
      <div className="card max-w-md w-full text-center py-8">
        {status === 'found' && (
          <>
            <Users className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-display text-primary mb-2">
              Du har blivit inbjuden
            </h1>
            <p className="text-muted mb-6">
              Någon vill dela sitt dödsbo med dig så att du kan följa processen.
            </p>
            <button
              onClick={handleAccept}
              className="btn-primary w-full mb-3"
            >
              {user ? 'Acceptera inbjudan' : 'Logga in och acceptera'}
            </button>
            <p className="text-xs text-muted">
              Du får läsbehörighet till dödsboet.
            </p>
          </>
        )}

        {status === 'accepting' && (
          <>
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
            <p className="text-muted">Accepterar inbjudan...</p>
          </>
        )}

        {status === 'accepted' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-display text-primary mb-2">
              Välkommen!
            </h1>
            <p className="text-muted mb-6">
              Du har nu tillgång till dödsboet. Du kan se alla uppgifter, tillgångar och dokument.
            </p>
            <Link href="/dashboard" className="btn-primary block">
              Gå till översikten
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertTriangle className="w-16 h-16 text-warn mx-auto mb-4" />
            <h1 className="text-2xl font-display text-primary mb-2">
              Något gick fel
            </h1>
            <p className="text-muted mb-6">{errorMsg}</p>
            <Link href="/dashboard" className="btn-primary block">
              Gå till startsidan
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
