'use client';

import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n';
import { PaywallGate } from '@/components/PaywallGate';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Camera, Upload, FileText, Check, X, Loader2, Eye } from 'lucide-react';
import Tesseract from 'tesseract.js';

type DocCategory = 'saldobesked' | 'dodsbevis' | 'testamente' | 'forsakringsbrev' | 'kvitto' | 'ovrigt';

interface ScannedDoc {
  id: string;
  category: DocCategory;
  imageUrl: string;
  extractedText: string;
  timestamp: string;
  fileName: string;
}

const CATEGORIES: { id: DocCategory; label: string; icon: string }[] = [
  { id: 'saldobesked', label: 'Saldobesked', icon: '🏦' },
  { id: 'dodsbevis', label: 'Dödsbevis', icon: '📋' },
  { id: 'testamente', label: 'Testamente', icon: '📜' },
  { id: 'forsakringsbrev', label: 'Försäkringsbrev', icon: '🛡️' },
  { id: 'kvitto', label: 'Kvitto/Faktura', icon: '🧾' },
  { id: 'ovrigt', label: 'Övrigt', icon: '📄' },
];

const STORAGE_KEY = 'sistaresan_scanned_docs';

function loadDocs(): ScannedDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDocs(docs: ScannedDoc[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export default function SkannerPage() {
  const { t } = useLanguage();
  const [docs, setDocs] = useState<ScannedDoc[]>(() => loadDocs());
  const [capturing, setCapturing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>('ovrigt');
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [ocrProgress, setOcrProgress] = useState(0);

  const processImage = useCallback(async (file: File) => {
    setProcessing(true);
    setOcrProgress(0);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // Run Tesseract.js OCR with Swedish + English support
      const result = await Tesseract.recognize(file, 'swe+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round((m.progress || 0) * 100));
          }
        },
      });

      const text = result.data.text.trim() || '(Ingen text kunde extraheras från bilden)';
      setExtractedText(text);

      // Auto-categorize based on extracted text
      const lower = text.toLowerCase();
      if (lower.includes('saldo') || lower.includes('konto') || lower.includes('bank') || lower.includes('ränta')) {
        setSelectedCategory('saldobesked');
      } else if (lower.includes('dödsbevis') || lower.includes('dödsfall') || lower.includes('folkbokföring')) {
        setSelectedCategory('dodsbevis');
      } else if (lower.includes('testamente') || lower.includes('förordnande') || lower.includes('sista vilja')) {
        setSelectedCategory('testamente');
      } else if (lower.includes('försäkring') || lower.includes('premie') || lower.includes('livförsäkring') || lower.includes('efterlevande')) {
        setSelectedCategory('forsakringsbrev');
      } else if (lower.includes('kvitto') || lower.includes('faktura') || lower.includes('belopp') || lower.includes('moms')) {
        setSelectedCategory('kvitto');
      } else {
        setSelectedCategory('ovrigt');
      }

      setShowResult(true);
    } catch (err) {
      console.error('OCR error:', err);
      setExtractedText('Kunde inte bearbeta bilden. Försök med en tydligare bild.');
      setShowResult(true);
    } finally {
      setProcessing(false);
      setOcrProgress(0);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const saveDocument = () => {
    if (!previewUrl) return;
    const doc: ScannedDoc = {
      id: crypto.randomUUID(),
      category: selectedCategory,
      imageUrl: previewUrl,
      extractedText,
      timestamp: new Date().toISOString(),
      fileName: `${selectedCategory}_${new Date().toISOString().slice(0, 10)}.jpg`,
    };
    const updated = [doc, ...docs];
    setDocs(updated);
    saveDocs(updated);
    resetCapture();
  };

  const resetCapture = () => {
    setPreviewUrl(null);
    setExtractedText('');
    setShowResult(false);
    setCapturing(false);
  };

  const deleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    saveDocs(updated);
  };

  return (
    <PaywallGate feature="scanner">
    <div className="min-h-dvh bg-background pb-28">
      <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> {t('Dashboard', 'Dashboard')}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-display text-primary">{t('Dokumentskanner', 'Document scanner')}</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          {t('Fota kvitton, brev och dokument direkt med kameran, eller ladda upp från telefonen.', 'Take photos of receipts, letters and documents directly with the camera, or upload from your phone.')}
        </p>

        {/* Processing overlay */}
        {processing && (
          <div className="card mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <p className="text-sm text-primary font-medium">{t('Läser text från bilden med OCR...', 'Reading text from image with OCR...')}</p>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${ocrProgress}%`, background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
              />
            </div>
            <p className="text-xs text-muted mt-1">{ocrProgress}% {t('klart', 'done')}</p>
          </div>
        )}

        {/* Result view */}
        {showResult && previewUrl && (
          <div className="card mb-6">
            <Image
              src={previewUrl}
              alt="Skannat dokument"
              width={600}
              height={256}
              className="w-full rounded-lg mb-4 max-h-64 object-contain bg-background"
              unoptimized
            />

            {/* Category picker */}
            <p className="text-xs text-muted mb-2">{t('Kategori', 'Category')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCategory === cat.id
                      ? 'text-white border-accent'
                      : 'bg-white text-primary border-border hover:border-accent'
                  }`}
                  style={selectedCategory === cat.id ? { background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' } : {}}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Extracted text */}
            {extractedText && (
              <div className="mb-4">
                <p className="text-xs text-muted mb-1">{t('Extraherad text', 'Extracted text')}</p>
                <textarea
                  value={extractedText}
                  onChange={e => setExtractedText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-[20px] text-xs font-mono"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={saveDocument} className="btn-primary flex items-center justify-center gap-2 text-sm">
                <Check className="w-4 h-4" /> {t('Spara', 'Save')}
              </button>
              <button onClick={resetCapture} className="btn-secondary flex items-center justify-center gap-2 text-sm">
                <X className="w-4 h-4" /> {t('Avbryt', 'Cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Capture buttons */}
        {!showResult && !processing && (
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn-primary flex items-center justify-center gap-2 py-4"
            >
              <Camera className="w-5 h-5" /> {t('Öppna kameran och fota', 'Open camera and take photo')}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> {t('Välj bild från telefonen', 'Choose image from phone')}
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Saved documents */}
        {docs.length > 0 && (
          <>
            <h2 className="font-display text-primary text-sm mb-3">
              {t('Sparade dokument', 'Saved documents')} ({docs.length})
            </h2>
            <div className="space-y-3">
              {docs.map(doc => {
                const cat = CATEGORIES.find(c => c.id === doc.category);
                return (
                  <div key={doc.id} className="card flex items-start gap-3">
                    <Image
                      src={doc.imageUrl}
                      alt={doc.fileName}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded object-cover bg-background shrink-0"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{cat?.icon}</span>
                        <p className="text-sm font-medium text-primary">{cat?.label}</p>
                      </div>
                      <p className="text-xs text-muted truncate">{doc.extractedText.slice(0, 80)}...</p>
                      <p className="text-xs text-muted mt-1">
                        {new Date(doc.timestamp).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteDoc(doc.id)}
                      className="text-muted hover:text-warn transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {docs.length === 0 && !showResult && !processing && (
          <div className="text-center py-12 text-muted">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t('Inga skannade dokument ännu.', 'No scanned documents yet.')}</p>
            <p className="text-xs mt-1">{t('Fota ett kvitto eller brev för att komma igång.', 'Take a photo of a receipt or letter to get started.')}</p>
          </div>
        )}
      </div>
    </div>
    </PaywallGate>
  );
}
