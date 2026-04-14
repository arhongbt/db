'use client';

import { useEffect, useState } from 'react';
import { X, Smartphone, CreditCard, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface PaymentFlowProps {
  amount: number;
  description: string;
  onComplete: () => void;
  onCancel: () => void;
}

type PaymentMethod = 'select' | 'swish' | 'card';
type PaymentStage = 'method' | 'input' | 'processing' | 'success';

export function PaymentFlow({
  amount,
  description,
  onComplete,
  onCancel,
}: PaymentFlowProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('select');
  const [stage, setStage] = useState<PaymentStage>('method');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [swishPhone, setSwishPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Load saved phone number from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sr_swish_phone');
      if (saved) setSwishPhone(saved);
    } catch {
      // ignore
    }
  }, []);

  // Save phone number when changed
  const handlePhoneChange = (value: string) => {
    setSwishPhone(value);
    try {
      localStorage.setItem('sr_swish_phone', value);
    } catch {
      // ignore
    }
  };

  // Handle method selection
  const handleSelectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setStage('input');
  };

  // Handle payment initiation
  const handlePay = () => {
    if (paymentMethod === 'swish' && !swishPhone.trim()) {
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim())) {
      return;
    }

    setStage('processing');

    // Simulate payment processing for 2 seconds
    setTimeout(() => {
      setStage('success');

      // Callback after 1 second
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, 2000);
  };

  // Format card number with spaces (every 4 digits)
  const formatCardDisplay = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(formatted);
  };

  const formatSEK = (num: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(42, 38, 34, 0.6)' }}
      onClick={stage === 'method' ? onCancel : undefined}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid #E8E4DE' }}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E8E4DE' }}>
          <h2 className="text-lg font-bold text-primary">Betalning</h2>
          {stage === 'method' || stage === 'input' ? (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-background rounded-full transition-colors"
              aria-label="Stäng"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          ) : null}
        </div>

        <div className="p-6">
          {/* Amount display */}
          <div className="mb-6 p-4 rounded-xl" style={{ background: '#E8F0E8' }}>
            <p className="text-xs text-muted font-medium mb-1">Belopp</p>
            <p className="text-2xl font-bold text-primary">{formatSEK(amount)}</p>
            <p className="text-xs text-muted mt-2">{description}</p>
          </div>

          {/* Method selection */}
          {stage === 'method' && (
            <div className="space-y-3">
              <button
                onClick={() => handleSelectMethod('swish')}
                className="w-full p-4 rounded-xl border-2 transition-all hover:border-accent"
                style={{ borderColor: '#E8E4DE' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E8F0E8' }}>
                    <Smartphone className="w-5 h-5" style={{ color: '#7A9E7E' }} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-primary text-sm">Swish</p>
                    <p className="text-xs text-muted">Betala direkt från mobilen</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelectMethod('card')}
                className="w-full p-4 rounded-xl border-2 transition-all hover:border-accent"
                style={{ borderColor: '#E8E4DE' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E8F0E8' }}>
                    <CreditCard className="w-5 h-5" style={{ color: '#7A9E7E' }} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-primary text-sm">Kort</p>
                    <p className="text-xs text-muted">Betala med kortuppgifter</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Swish input */}
          {stage === 'input' && paymentMethod === 'swish' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  value={swishPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="w-full px-4 py-3 border-2 rounded-xl text-base focus:outline-none transition-colors"
                  style={{
                    borderColor: swishPhone.trim() ? '#D4DBC9' : '#E8E4DE',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#7A9E7E';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = swishPhone.trim() ? '#D4DBC9' : '#E8E4DE';
                  }}
                />
                <p className="text-xs text-muted mt-2">Öppna Swish-appen på samma enhet</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStage('method')}
                  className="flex-1 py-3 px-4 rounded-xl border-2 text-primary font-medium transition-colors hover:bg-background"
                  style={{ borderColor: '#E8E4DE' }}
                >
                  Tillbaka
                </button>
                <button
                  onClick={handlePay}
                  disabled={!swishPhone.trim()}
                  className="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-opacity disabled:opacity-50"
                  style={{ background: swishPhone.trim() ? '#7A9E7E' : '#999' }}
                >
                  Öppna Swish
                </button>
              </div>
            </div>
          )}

          {/* Card input */}
          {stage === 'input' && paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Kortnummer
                </label>
                <div className="relative">
                  <input
                    type={showCardNumber ? 'text' : 'password'}
                    value={formatCardDisplay(cardNumber)}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-3 border-2 rounded-xl text-base focus:outline-none transition-colors pr-12"
                    style={{ borderColor: '#E8E4DE' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7A9E7E';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E4DE';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                  >
                    {showCardNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    MM/ÅÅ
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                    placeholder="12/26"
                    className="w-full px-4 py-3 border-2 rounded-xl text-base focus:outline-none transition-colors"
                    style={{ borderColor: '#E8E4DE' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7A9E7E';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E4DE';
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    CVC
                  </label>
                  <input
                    type="password"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.slice(0, 4))}
                    placeholder="•••"
                    className="w-full px-4 py-3 border-2 rounded-xl text-base focus:outline-none transition-colors"
                    style={{ borderColor: '#E8E4DE' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7A9E7E';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E8E4DE';
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStage('method')}
                  className="flex-1 py-3 px-4 rounded-xl border-2 text-primary font-medium transition-colors hover:bg-background"
                  style={{ borderColor: '#E8E4DE' }}
                >
                  Tillbaka
                </button>
                <button
                  onClick={handlePay}
                  disabled={!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()}
                  className="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-opacity disabled:opacity-50"
                  style={{ background: cardNumber.trim() && cardExpiry.trim() && cardCVC.trim() ? '#7A9E7E' : '#999' }}
                >
                  Betala
                </button>
              </div>
            </div>
          )}

          {/* Processing state */}
          {stage === 'processing' && (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#E8F0E8' }}
              >
                <div className="w-8 h-8 border-3 border-transparent border-t-accent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Bearbetar betalning...</h3>
              <p className="text-sm text-muted">Vänta medan vi verifierar din betalning</p>
            </div>
          )}

          {/* Success state */}
          {stage === 'success' && (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#E8F0E8' }}
              >
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Betalning genomförd!</h3>
              <p className="text-sm text-muted">
                {formatSEK(amount)} har debiterats
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
