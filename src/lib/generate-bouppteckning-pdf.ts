// ============================================================
// Bouppteckning PDF Generator (client-side)
// Renders a Skatteverket-style legal document using jsPDF
// ============================================================

import { jsPDF } from 'jspdf';
import type { BouppteckningDocument, BouppteckningSection } from './generate-bouppteckning';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const ML = 22; // margin left
const MR = 22; // margin right
const MT = 28; // margin top
const MB = 25; // margin bottom
const CW = PAGE_WIDTH - ML - MR; // content width

// Brand color
const BRAND = { r: 44, g: 74, b: 110 }; // #2C4A6E

/**
 * Generate and download a PDF from a BouppteckningDocument.
 */
export function downloadBouppteckningPDF(doc: BouppteckningDocument): void {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MT;

  // ── Page 1: Title block ──
  y = renderTitleBlock(pdf, doc, y);

  // ── Warnings ──
  if (doc.warnings.length > 0) {
    y = renderWarnings(pdf, doc.warnings, y);
  }

  // ── Sections ──
  for (const section of doc.sections) {
    y = ensureSpace(pdf, y, 35);
    y = renderSection(pdf, section, y);
  }

  // ── Footer on every page ──
  renderFooters(pdf);

  // ── Download ──
  const safeName = (doc.title || 'bouppteckning')
    .replace(/[^a-zA-ZåäöÅÄÖ0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  pdf.save(`${safeName}.pdf`);
}

// ─────────────────────────────────────────────
// Title block
// ─────────────────────────────────────────────

function renderTitleBlock(pdf: jsPDF, doc: BouppteckningDocument, y: number): number {
  // Top border line
  pdf.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  pdf.setLineWidth(1);
  pdf.line(ML, y - 5, PAGE_WIDTH - MR, y - 5);

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  pdf.text('BOUPPTECKNING', PAGE_WIDTH / 2, y + 4, { align: 'center' });
  y += 12;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60);
  pdf.text(doc.title, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6;

  // Generation date
  pdf.setFontSize(8);
  pdf.setTextColor(130);
  const generatedDate = new Date(doc.generatedAt).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  pdf.text(`Dokument genererat: ${generatedDate}`, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 5;

  // Bottom border
  pdf.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  pdf.setLineWidth(0.5);
  pdf.line(ML, y, PAGE_WIDTH - MR, y);
  y += 8;

  return y;
}

// ─────────────────────────────────────────────
// Warnings box
// ─────────────────────────────────────────────

function renderWarnings(pdf: jsPDF, warnings: string[], y: number): number {
  const lineHeight = 4.5;
  const padding = 5;
  const boxHeight = padding * 2 + warnings.length * lineHeight + 2;

  pdf.setFillColor(255, 248, 235);
  pdf.setDrawColor(220, 170, 80);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(ML, y, CW, boxHeight, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(180, 100, 0);
  pdf.text('VARNING — Ofullständiga uppgifter:', ML + padding, y + padding + 2);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  warnings.forEach((w, i) => {
    pdf.text(`• ${w}`, ML + padding + 2, y + padding + 7 + i * lineHeight);
  });

  pdf.setTextColor(0);
  return y + boxHeight + 6;
}

// ─────────────────────────────────────────────
// Section renderer (handles fields, tables, content)
// ─────────────────────────────────────────────

function renderSection(pdf: jsPDF, section: BouppteckningSection, y: number): number {
  // Section heading with background
  pdf.setFillColor(240, 244, 248);
  pdf.rect(ML, y - 1, CW, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  pdf.text(section.heading, ML + 3, y + 4);
  y += 10;

  // ── Labeled fields ──
  if (section.fields) {
    y = renderFields(pdf, section.fields, y);
  }

  // ── Table rows ──
  if (section.tableRows) {
    y = renderTable(pdf, section.tableRows, y);
  }

  // ── Total row ──
  if (section.totalRow) {
    y = ensureSpace(pdf, y, 12);
    pdf.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
    pdf.setLineWidth(0.4);
    pdf.line(ML + 2, y, PAGE_WIDTH - MR - 2, y);
    y += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    pdf.text(section.totalRow[0], ML + 4, y);
    pdf.text(section.totalRow[1], PAGE_WIDTH - MR - 4, y, { align: 'right' });
    y += 6;
    pdf.setTextColor(0);
  }

  // ── Free text content ──
  if (section.content) {
    y = renderContent(pdf, section.content, y);
  }

  y += 4; // section gap
  return y;
}

// ─────────────────────────────────────────────
// Labeled fields (like SKV form layout)
// ─────────────────────────────────────────────

function renderFields(pdf: jsPDF, fields: [string, string][], y: number): number {
  const labelWidth = 50;

  for (const [label, value] of fields) {
    y = ensureSpace(pdf, y, 8);

    // Label
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(120);
    pdf.text(label, ML + 4, y);

    // Value
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(30);
    const isPlaceholder = value.startsWith('[');
    if (isPlaceholder) {
      pdf.setTextColor(180);
      pdf.setFont('helvetica', 'italic');
    }
    pdf.text(value, ML + labelWidth, y);
    pdf.setFont('helvetica', 'normal');

    // Light underline
    pdf.setDrawColor(220);
    pdf.setLineWidth(0.15);
    pdf.line(ML + 4, y + 1.5, PAGE_WIDTH - MR - 4, y + 1.5);

    y += 7;
  }

  return y;
}

// ─────────────────────────────────────────────
// Table (description + value columns)
// ─────────────────────────────────────────────

function renderTable(pdf: jsPDF, rows: [string, string][], y: number): number {
  for (const [desc, val] of rows) {
    y = ensureSpace(pdf, y, 8);

    // Subcategory headers
    if (desc.startsWith('──')) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(BRAND.r, BRAND.g, BRAND.b);
      pdf.text(desc.replace(/──/g, '').trim(), ML + 4, y + 1);
      y += 6;
      continue;
    }

    // Regular row
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(40);

    // Wrap description if long
    const maxDescWidth = CW - 45;
    const wrapped = pdf.splitTextToSize(desc, maxDescWidth);

    for (let i = 0; i < wrapped.length; i++) {
      if (i > 0) y = ensureSpace(pdf, y, 5);
      pdf.text(wrapped[i], ML + 6, y);
      if (i === 0 && val) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(val, PAGE_WIDTH - MR - 4, y, { align: 'right' });
        pdf.setFont('helvetica', 'normal');
      }
      y += 4.5;
    }

    // Dotted separator
    pdf.setDrawColor(230);
    pdf.setLineWidth(0.1);
    pdf.line(ML + 6, y, PAGE_WIDTH - MR - 4, y);
    y += 2;
  }

  return y;
}

// ─────────────────────────────────────────────
// Free text content
// ─────────────────────────────────────────────

function renderContent(pdf: jsPDF, content: string, y: number): number {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(50);

  const lines = content.split('\n');
  for (const line of lines) {
    y = ensureSpace(pdf, y, 6);

    if (line.trim() === '') {
      y += 2.5;
      continue;
    }

    // Signature lines
    if (line.startsWith('___')) {
      pdf.setDrawColor(60);
      pdf.setLineWidth(0.3);
      // Split on multiple underline blocks
      const segments = line.split(/\s{4,}/);
      if (segments.length >= 2) {
        const lineWidth = CW / 2 - 15;
        pdf.line(ML + 4, y, ML + 4 + lineWidth, y);
        pdf.line(ML + CW / 2 + 10, y, ML + CW / 2 + 10 + lineWidth, y);
      } else {
        pdf.line(ML + 4, y, ML + 4 + CW * 0.4, y);
      }
      y += 4;
      continue;
    }

    // Bold key lines
    const isBold = line.startsWith('Ovanstående') || line.startsWith('Vi intygar');
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    }

    const wrapped = pdf.splitTextToSize(line, CW - 8);
    for (const wl of wrapped) {
      y = ensureSpace(pdf, y, 5);
      pdf.text(wl, ML + 4, y);
      y += 4.5;
    }

    if (isBold) {
      pdf.setFont('helvetica', 'normal');
    }
  }

  return y;
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MB) {
    pdf.addPage();
    return MT;
  }
  return y;
}

function renderFooters(pdf: jsPDF): void {
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    // Draft watermark
    pdf.setFontSize(7);
    pdf.setTextColor(170);
    pdf.setFont('helvetica', 'italic');
    pdf.text(
      'UTKAST — Ska granskas av förrättningsmän och registreras hos Skatteverket',
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 14,
      { align: 'center' }
    );

    // Page number
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(150);
    pdf.text(`Sida ${i} av ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, {
      align: 'center',
    });

    // Bottom border
    pdf.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
    pdf.setLineWidth(0.3);
    pdf.line(ML, PAGE_HEIGHT - 18, PAGE_WIDTH - MR, PAGE_HEIGHT - 18);
  }
}
