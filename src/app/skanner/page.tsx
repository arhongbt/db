'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Upload, FileText, Check, X, Loader2 } from 'lucide-react';

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
  const [docs, setDocs] = useState<ScannedDoc[]>(() => loadDocs());
  const [capturing, setCapturing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>('ovrigt');
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    setProcessing(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // Use browser-native OCR via createImageBitmap + canvas
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // Try Tesseract.js if available, otherwise store image without OCR
      let text = '';
      try {
        const Tesseract = await import('tesseract.js');
        const result = await Tesseract.recognize(canvas, 'swe', {
          logger: () => {},
        });
        text = result.data.text;
      } catch {
        text = '(OCR ej tillgängligt — bilden sparas utan textextraktion)';
      }

      setExtractedText(text);

      // Auto-categorize based on text content
      const lower = text.toLowerCase();
      if (lower.includes('saldo') || lower.includes('konto') || lower.includes('bank')) {
        setSelectedCategory('saldobesked');
      } else if (lower.includes('dödsbevis') || lower.includes('dödsfall')) {
        setSelectedCategory('dodsbevis');
      } else if (lower.includes('testamente') || lower.includes('förordnande')) {
        setSelectedCategory('testamente');
      } else if (lower.includes('försäkring') || lower.includes('premie') || lower.includes('livförsäkring')) {
        setSelectedCategory('forsakringsbrev');
      } else if (lower.includes('kvitto') || lower.includes('faktura') || lower.includes('belopp')) {
        setSelectedCategory('kvitto');
      }

      setShowResult(true);
    } catch (err) {
      console.error('Image processing error:', err);
      setExtractedText('Kunde inte bearbeta bilden.');
      setShowResult(true);
    } finally {
      setProcessing(false);
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
    <div className="min-h-dvh bg-background">
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">Dokumentskanner</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Fota kvitton, brev och dokument. Texten extraheras automatiskt.
        </p>

        {/* Processing overlay */}
        {processing && (
          <div className="card mb-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
            <p className="text-sm text-primary">Bearbetar bild och extraherar text...</p>
          </div>
        )}

        {/* Result view */}
        {showResult && previewUrl && (
          <div className="card mb-6">
            <img
              src={previewUrl}
              alt="Skannat dokument"
              className="w-full rounded-lg mb-4 max-h-64 object-contain bg-gray-100"
            />

            {/* Category picker */}
            <p className="text-xs text-muted mb-2">Kategori</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-primary border-border hover:border-accent'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Extracted text */}
            {extractedText && (
              <div className="mb-4">
                <p className="text-xs text-muted mb-1">Extraherad text</p>
                <textarea
                  value={extractedText}
                  onChange={e => setExtractedText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={saveDocument} className="btn-primary flex items-center justify-center gap-2 text-sm">
                <Check className="w-4 h-4" /> Spara
              </button>
              <button onClick={resetCapture} className="btn-secondary flex items-center justify-center gap-2 text-sm">
                <X className="w-4 h-4" /> Avbryt
              </button>
            </div>
          </div>
        )}

        {/* Capture buttons */}
        {!showResult && !processing && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
            >
              <Camera className="w-4 h-4" /> Fota dokument
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" /> Ladda upp
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
            <h2 className="font-semibold text-primary text-sm mb-3">
              Sparade dokument ({docs.length})
            </h2>
            <div className="space-y-3">
              {docs.map(doc => {
                const cat = CATEGORIES.find(c => c.id === doc.category);
                return (
                  <div key={doc.id} className="card flex items-start gap-3">
                    <img
                      src={doc.imageUrl}
                      alt={doc.fileName}
                      className="w-16 h-16 rounded object-cover bg-gray-100 shrink-0"
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
            <p className="text-sm">Inga skannade dokument ännu.</p>
            <p className="text-xs mt-1">Fota ett kvitto eller brev för att komma igång.</p>
          </div>
        )}
      </div>
    </div>
  );
}
