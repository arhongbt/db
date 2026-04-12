'use client';

import { useState } from 'react';
import { Heart, ArrowLeft, Bot, Flame, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';

function MikeRossTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl mb-5" style={{ background: '#EEF2EA' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-accent mb-0.5">Mike Ross</p>
        <p className="text-sm text-primary/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

const colorThemes = [
  { name: 'Ljus', value: '#F7F5F0', label: 'Ljus' },
  { name: 'Natur', value: '#EEF2EA', label: 'Natur' },
  { name: 'Himmel', value: '#E8EFF5', label: 'Himmel' },
  { name: 'Solnedgång', value: '#F5EDE8', label: 'Solnedgång' },
];

function MemorialContent() {
  let state = { deceasedName: '', deathDate: '' };
  try {
    const dodsboContext = useDodsbo();
    state = dodsboContext.state;
  } catch (e) {
    // No provider context available - guest mode
  }

  const isGuestMode = !state.deceasedName;
  const [isPreview, setIsPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    namn: state.deceasedName || '',
    född: '',
    avliden: state.deathDate || '',
    minnesord: '',
    favoritminne: '',
    citat: '',
    theme: '#EEF2EA',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('minnesida', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleShare = async () => {
    const memorialText = `
${form.namn}
${form.född} – ${form.avliden}

${form.minnesord}

"${form.favoritminne}"

${form.citat}
    `.trim();

    try {
      await navigator.clipboard.writeText(memorialText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kunde inte kopiera:', err);
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: form.theme }}>
        <div className="w-full max-w-md py-12">
          {/* Header with back button */}
          <div className="mb-8">
            <button
              onClick={() => setIsPreview(false)}
              className="flex items-center gap-2 text-primary/70 hover:text-primary mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Tillbaka till redigering</span>
            </button>
          </div>

          {/* Memorial Card */}
          <div className="bg-white rounded-2xl p-8 text-center space-y-6 border" style={{ borderColor: '#E8E4DE' }}>
            <Flame className="w-8 h-8 text-primary/60 mx-auto" />

            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div>
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                {form.namn}
              </h1>
              <p className="text-sm text-primary/70">
                {form.född} – {form.avliden}
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {form.minnesord && (
              <p className="text-primary/90 leading-relaxed text-sm">
                {form.minnesord}
              </p>
            )}

            {form.favoritminne && (
              <p className="text-primary/80 italic text-sm">
                {form.favoritminne}
              </p>
            )}

            {form.citat && (
              <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#E8E4DE' }}>
                <p className="text-sm text-primary/80 font-light">
                  {form.citat}
                </p>
              </div>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kopierad!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Dela minnesida
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-background border-b z-10" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary/60 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="flex items-center gap-2 text-xl font-bold text-primary">
            <Heart className="w-5 h-5 fill-primary" />
            Minnesida
          </h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {isGuestMode && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-2xl">
            <p className="text-sm text-primary font-medium">
              Du kan skapa en minnesida utan att starta ett dödsbo. Fyll i uppgifterna nedan.
            </p>
          </div>
        )}

        <MikeRossTip text="En minnesida är ett fint sätt att hedra den du förlorat. Du kan dela den med familj och vänner. Allt sparas lokalt på din enhet — inget publiceras utan ditt godkännande." />

        <div className="space-y-5">
          {/* Namn */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Namn
            </label>
            <input
              type="text"
              value={form.namn}
              onChange={(e) => handleInputChange('namn', e.target.value)}
              placeholder="Namn på den du saknar"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
            />
          </div>

          {/* Född */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Född
            </label>
            <input
              type="text"
              value={form.född}
              onChange={(e) => handleInputChange('född', e.target.value)}
              placeholder="t.ex. 12 mars 1945"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
            />
          </div>

          {/* Avliden */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Avliden
            </label>
            <input
              type="text"
              value={form.avliden}
              onChange={(e) => handleInputChange('avliden', e.target.value)}
              placeholder="Datum för bortgången"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
            />
          </div>

          {/* Minnesord */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Minnesord
            </label>
            <textarea
              value={form.minnesord}
              onChange={(e) => handleInputChange('minnesord', e.target.value)}
              placeholder="Skriv några ord om den du saknar..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none"
            />
          </div>

          {/* Favoritminne */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Favoritminne
            </label>
            <textarea
              value={form.favoritminne}
              onChange={(e) => handleInputChange('favoritminne', e.target.value)}
              placeholder="Dela ett kärt minne..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background resize-none"
            />
          </div>

          {/* Citat eller livsvisdom */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Citat eller livsvisdom
            </label>
            <input
              type="text"
              value={form.citat}
              onChange={(e) => handleInputChange('citat', e.target.value)}
              placeholder="Ett citat som speglar personen..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background"
            />
          </div>

          {/* Color Theme Picker */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">
              Färgtema
            </label>
            <div className="flex gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleInputChange('theme', theme.value)}
                  className="flex flex-col items-center gap-2"
                  title={theme.label}
                >
                  <div
                    className={`w-12 h-12 rounded-full transition-all ${
                      form.theme === theme.value
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:ring-2 hover:ring-primary/30'
                    }`}
                    style={{ background: theme.value }}
                  />
                  <span className="text-xs text-primary/70">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={() => setIsPreview(true)}
              className="flex-1 px-4 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors"
            >
              Förhandsgranska
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                saved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {saved ? 'Sparad!' : 'Spara minnesida'}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function MinnesidaPage() {
  return (
    <DodsboProvider>
      <MemorialContent />
    </DodsboProvider>
  );
}
