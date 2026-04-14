'use client';

import { useEffect, useState } from 'react';
import { X, Shield, CheckCircle2 } from 'lucide-react';

interface BankIDVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

export function BankIDVerification({ onVerified, onCancel }: BankIDVerificationProps) {
  const [stage, setStage] = useState<'waiting' | 'verifying' | 'success'>('waiting');

  useEffect(() => {
    if (stage === 'waiting') {
      // Start verification after brief delay
      const timer = setTimeout(() => {
        setStage('verifying');
      }, 500);
      return () => clearTimeout(timer);
    }

    if (stage === 'verifying') {
      // Simulate verification process for 2-3 seconds
      const timer = setTimeout(() => {
        setStage('success');
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (stage === 'success') {
      // Store verification state and callback after 1 second
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('sr_bankid_verified', JSON.stringify({
            verified: true,
            timestamp: new Date().toISOString(),
          }));
        } catch {
          // ignore localStorage errors
        }
        onVerified();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, onVerified]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(42, 38, 34, 0.6)' }}
      onClick={stage === 'waiting' ? onCancel : undefined}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid #E8E4DE' }}
      >
        {/* Close button — only visible in waiting stage */}
        {stage === 'waiting' && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-background rounded-full transition-colors"
            aria-label="Stäng"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        )}

        {/* Waiting stage */}
        {stage === 'waiting' && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(107,127,94,0.08)' }}
            >
              <Shield className="w-8 h-8" style={{ color: '#6B7F5E' }} />
            </div>
            <h2 className="text-xl font-display text-primary mb-2">BankID-verifiering</h2>
            <p className="text-sm text-muted mb-6">
              Öppna BankID-appen på din enhet och godkänn verifieringen.
            </p>
            <p className="text-xs text-muted/60 mb-4">Eller klicka utanför för att avbryta</p>
          </div>
        )}

        {/* Verifying stage — spinner */}
        {stage === 'verifying' && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(107,127,94,0.08)' }}
            >
              <div className="w-8 h-8 border-3 border-transparent border-t-accent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-display text-primary mb-2">Verifierar...</h2>
            <p className="text-sm text-muted">
              Vänta medan vi godkänner din identitet
            </p>
          </div>
        )}

        {/* Success stage */}
        {stage === 'success' && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(107,127,94,0.08)' }}
            >
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-display text-primary mb-2">Verifiering lyckades!</h2>
            <p className="text-sm text-muted">
              Du är nu verifierad och kan fortsätta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
