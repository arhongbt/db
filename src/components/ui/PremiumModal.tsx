'use client';

import { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const waitlist = JSON.parse(localStorage.getItem('premium_waitlist') || '[]');
    waitlist.push({ email, date: new Date().toISOString() });
    localStorage.setItem('premium_waitlist', JSON.stringify(waitlist));
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(42, 38, 34, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <button onClick={onClose} className="text-muted-light hover:text-primary transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-primary mb-1">Mike Ross Premium</h2>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Obegränsade juridiska frågor, prioriterat stöd och avancerade dokumentmallar.
          Premium lanseras snart.
        </p>

        <ul className="space-y-2 mb-5">
          {[
            'Obegränsade frågor till Mike Ross',
            'Prioriterat e-poststöd',
            'Avancerade dokumentmallar',
            'Exportera all data som PDF',
          ].map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#EEF2EA' }}>
              <Check className="w-6 h-6 text-accent" />
            </div>
            <p className="font-semibold text-primary mb-1">Tack!</p>
            <p className="text-sm text-muted">Vi meddelar dig när Premium lanseras.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              required
              className="w-full px-4 py-3 border rounded-xl text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-3 bg-background"
              style={{ borderColor: '#E8E4DE' }}
            />
            <button type="submit" className="btn-primary w-full !rounded-xl !py-3">
              Meddela mig när det lanseras
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
