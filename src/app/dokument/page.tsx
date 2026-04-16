'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
// Decorations removed — caused z-index/visibility bugs on mobile
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Plus,
  X,
  File,
  Image,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import {
  uploadDokument,
  getDokument,
  getDokumentUrl,
  deleteDokument,
  formatFileSize,
  getCategoryLabel,
  DOKUMENT_CATEGORIES,
  type DokumentCategory,
} from '@/lib/supabase/services/dokument-service';
import type { Database } from '@/lib/supabase/types';

type DokumentRow = Database['public']['Tables']['dokument']['Row'];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  return FileText;
}

function DokumentContent() {
  const { t } = useLanguage();
  const { state, loading: stateLoading } = useDodsbo();
  const [dokuments, setDokuments] = useState<DokumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [category, setCategory] = useState<DokumentCategory>('ovrigt');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents
  const loadDokuments = useCallback(async () => {
    if (!state.id) return;
    setLoading(true);
    const { data } = await getDokument(state.id);
    setDokuments(data ?? []);
    setLoading(false);
  }, [state.id]);

  useEffect(() => {
    if (!stateLoading && state.id) {
      loadDokuments();
    }
  }, [stateLoading, state.id, loadDokuments]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError(t(`Filen är för stor (max ${formatFileSize(MAX_FILE_SIZE)})`, `File is too large (max ${formatFileSize(MAX_FILE_SIZE)})`));
      return;
    }
    setSelectedFile(file);
    setError('');
    setShowUpload(true);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedFile || !state.id) return;
    setUploading(true);
    setError('');

    const { data, error: uploadErr } = await uploadDokument(
      state.id,
      selectedFile,
      category,
      notes || undefined
    );

    setUploading(false);

    if (uploadErr) {
      setError(uploadErr.message);
      return;
    }

    if (data) {
      setDokuments((prev) => [data, ...prev]);
    }

    setSuccess(t(`"${selectedFile.name}" uppladdad!`, `"${selectedFile.name}" uploaded!`));
    setSelectedFile(null);
    setCategory('ovrigt');
    setNotes('');
    setShowUpload(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Download
  const handleDownload = async (doc: DokumentRow) => {
    const url = await getDokumentUrl(doc.storage_path);
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Delete
  const handleDelete = async (doc: DokumentRow) => {
    if (!confirm(t(`Ta bort "${doc.file_name}"?`, `Delete "${doc.file_name}"?`))) return;
    await deleteDokument(doc.id, doc.storage_path);
    setDokuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  if (stateLoading) {
    return (
      <div className="min-h-dvh bg-background p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Group by category
  const grouped = dokuments.reduce<Record<string, DokumentRow[]>>((acc, d) => {
    (acc[d.category] ??= []).push(d);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-4 py-5 pb-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-display text-primary">{t('Dokument', 'Documents')}</h1>
          <p className="text-muted text-sm mt-1">
            {dokuments.length > 0
              ? t(`${dokuments.length} fil(er) uppladdade`, `${dokuments.length} file(s) uploaded`)
              : t('Ladda upp underlag till bouppteckningen', 'Upload documents for the estate inventory')}
          </p>
        </div>
        <button
          onClick={() => {
            setShowUpload(true);
            setSelectedFile(null);
          }}
          className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
          aria-label={t('Ladda upp dokument', 'Upload document')}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="info-box mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          <span className="text-sm text-primary">{success}</span>
        </div>
      )}

      {/* Error toast */}
      {error && !showUpload && (
        <div className="warning-box mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload area */}
      {!showUpload && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 mb-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-accent bg-accent/5'
              : 'border-[#E8E4DE] hover:border-accent/50'
          }`}
        >
          <Upload className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-primary mb-1">
            {t('Dra och släpp fil här', 'Drag and drop file here')}
          </p>
          <p className="text-xs text-muted">
            {t('eller klicka för att välja', 'or click to choose')} (max {formatFileSize(MAX_FILE_SIZE)})
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {/* Upload form (shown after file selected) */}
      {showUpload && (
        <div className="card border-2 border-accent mb-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display text-primary">
              {t('Ladda upp dokument', 'Upload document')}
            </h3>
            <button
              onClick={() => {
                setShowUpload(false);
                setSelectedFile(null);
                setError('');
              }}
              className="p-1 hover:bg-background rounded-full"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          {/* File picker */}
          {!selectedFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#E8E4DE] rounded-xl p-6 flex flex-col items-center gap-2 hover:border-accent/50 transition-colors mb-4"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-muted">{t('Välj fil', 'Choose file')}</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  e.target.value = '';
                }}
              />
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-primary-lighter/20 rounded-2xl px-4 py-3 mb-4">
              <File className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-background rounded-full"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>
          )}

          {/* Category */}
          <div className="mb-4">
            <span className="text-sm font-medium text-primary mb-2 block">
              {t('Kategori', 'Category')}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DOKUMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 px-3 rounded-full text-sm font-medium border-2 transition-colors ${
                    category === cat.value
                      ? 'border-accent bg-primary-lighter/30 text-primary'
                      : 'border-[#E8E4DE] text-muted'
                  }`}
                >
                  {t(cat.label, cat.label)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-primary mb-1 block">
              {t('Anteckning (valfritt)', 'Note (optional)')}
            </span>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('T.ex. Från Swedbank, saldo per 2024-01-15', 'E.g. From Swedbank, balance as of 2024-01-15')}
              className="w-full px-4 py-3 text-base border-2 border-[#E8E4DE] rounded-2xl focus:border-accent focus:outline-none bg-white"
            />
          </label>

          {error && (
            <div className="warning-box mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowUpload(false);
                setSelectedFile(null);
                setError('');
              }}
              className="btn-secondary flex-1"
            >
              {t('Avbryt', 'Cancel')}
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('Laddar upp...', 'Uploading...')}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {t('Ladda upp', 'Upload')}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : dokuments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-display text-primary mb-2">
            {t('Inga dokument ännu', 'No documents yet')}
          </h2>
          <p className="text-muted text-sm max-w-xs">
            {t('Samla viktiga handlingar här efterhand — dödsbevis, saldobesked, testamente. Allt behöver inte vara klart på en gång.', 'Gather important documents here gradually — death certificate, account statements, will. Everything doesn\'t have to be ready at once.')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, docs]) => (
            <div key={cat}>
              <h2 className="text-sm font-display text-muted mb-2">
                {t(getCategoryLabel(cat), getCategoryLabel(cat))} ({docs.length})
              </h2>
              <div className="flex flex-col gap-2">
                {docs.map((doc) => {
                  const Icon = getFileIcon(doc.mime_type);
                  return (
                    <div
                      key={doc.id}
                      className="card flex items-center gap-3"
                    >
                      <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">
                          {doc.file_name}
                        </p>
                        <p className="text-xs text-muted">
                          {formatFileSize(doc.file_size)}
                          {doc.notes && ` — ${doc.notes}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-accent hover:bg-accent/10 rounded-full transition-colors"
                        aria-label={t('Ladda ner', 'Download')}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-muted hover:text-warn transition-colors"
                        aria-label={t('Ta bort', 'Delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default function DokumentPage() {
  return (
    <DodsboProvider>
      <DokumentContent />
    </DodsboProvider>
  );
}
