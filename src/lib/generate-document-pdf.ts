// ============================================================
// Generic Document PDF Generator (client-side)
// Creates A4 PDFs from plain text documents (kallelse, fullmakt etc.)
// ============================================================

import { jsPDF } from 'jspdf';

const PAGE_WIDTH = 210;
const ML = 22;
const MR = 22;
const MT = 28;
const MB = 25;
const CW = PAGE_WIDTH - ML - MR;

const BRAND = { r: 44, g: 74, b: 110 }; // #2C4A6E

/**
 * Generate and download a PDF from plain text content.
 */
export function downloadDocumentPDF(
  title: string,
  content: string,
  filename: string
): void {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MT;

  // ── Header bar ──
  pdf.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  pdf.rect(0, 0, PAGE_WIDTH, 18, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sista Resan', ML, 12);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleDateString('sv-SE'), PAGE_WIDTH - MR, 12, { align: 'right' });

  y = 30;

  // ── Title ──
  pdf.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, ML, y);
  y += 10;

  // ── Content ──
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const lines = content.split('\n');

  for (const line of lines) {
    // Check if we need a new page
    if (y > 297 - MB) {
      pdf.addPage();
      y = MT;
    }

    if (line.trim() === '') {
      y += 4;
      continue;
    }

    // Check if line looks like a heading (ALL CAPS or starts with number and period)
    const isHeading = line === line.toUpperCase() && line.trim().length > 3 && line.trim().length < 60;
    const isSectionNum = /^\d+\.\s/.test(line.trim());

    if (isHeading) {
      y += 3;
      pdf.setFillColor(240, 242, 245);
      pdf.rect(ML, y - 4, CW, 7, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(BRAND.r, BRAND.g, BRAND.b);
      pdf.text(line.trim(), ML + 2, y);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont('helvetica', 'normal');
      y += 8;
    } else if (isSectionNum) {
      pdf.setFont('helvetica', 'bold');
      const wrapped = pdf.splitTextToSize(line, CW);
      for (const wl of wrapped) {
        if (y > 297 - MB) { pdf.addPage(); y = MT; }
        pdf.text(wl, ML, y);
        y += 5;
      }
      pdf.setFont('helvetica', 'normal');
    } else if (line.startsWith('───') || line.startsWith('────')) {
      // Horizontal rule
      y += 2;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(ML, y, ML + CW, y);
      y += 4;
    } else if (line.startsWith('☐ ')) {
      // Checkbox
      pdf.rect(ML, y - 3, 3, 3);
      const wrapped = pdf.splitTextToSize(line.slice(2), CW - 6);
      for (const wl of wrapped) {
        if (y > 297 - MB) { pdf.addPage(); y = MT; }
        pdf.text(wl, ML + 5, y);
        y += 5;
      }
    } else if (line.startsWith('_____')) {
      // Signature line
      y += 2;
      pdf.setDrawColor(100, 100, 100);
      pdf.line(ML, y, ML + 80, y);
      y += 5;
    } else {
      // Normal text — word wrap
      const wrapped = pdf.splitTextToSize(line, CW);
      for (const wl of wrapped) {
        if (y > 297 - MB) { pdf.addPage(); y = MT; }
        pdf.text(wl, ML, y);
        y += 5;
      }
    }
  }

  // ── Footer on all pages ──
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Skapad med Sista Resan — ${new Date().toLocaleDateString('sv-SE')}`,
      ML,
      297 - 10
    );
    pdf.text(
      `Sida ${i} av ${totalPages}`,
      PAGE_WIDTH - MR,
      297 - 10,
      { align: 'right' }
    );
  }

  // ── Download ──
  const safeName = filename
    .replace(/[^a-zA-ZåäöÅÄÖ0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  pdf.save(`${safeName}.pdf`);
}
