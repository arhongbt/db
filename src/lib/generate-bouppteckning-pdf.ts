// ============================================================
// Bouppteckning PDF Generator (client-side)
// Uses jsPDF to create a downloadable PDF from BouppteckningDocument
// ============================================================

import { jsPDF } from 'jspdf';
import type { BouppteckningDocument } from './generate-bouppteckning';

const PAGE_WIDTH = 210; // A4 mm
const MARGIN_LEFT = 25;
const MARGIN_RIGHT = 25;
const MARGIN_TOP = 30;
const MARGIN_BOTTOM = 25;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const PAGE_HEIGHT = 297; // A4 mm

/**
 * Generate and download a PDF from a BouppteckningDocument.
 */
export function downloadBouppteckningPDF(doc: BouppteckningDocument): void {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = MARGIN_TOP;

  // ── Title ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('BOUPPTECKNING', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 10;

  // ── Subtitle (deceased name) ──
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(doc.title, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6;

  // ── Date ──
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  const generatedDate = new Date(doc.generatedAt).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  pdf.text(`Genererad: ${generatedDate}`, PAGE_WIDTH / 2, y, {
    align: 'center',
  });
  pdf.setTextColor(0);
  y += 10;

  // ── Horizontal rule ──
  pdf.setDrawColor(30, 60, 94); // #1A3C5E
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 8;

  // ── Warnings ──
  if (doc.warnings.length > 0) {
    pdf.setFillColor(255, 243, 224); // warm warning bg
    const warningHeight = 6 + doc.warnings.length * 5;
    pdf.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, warningHeight, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(180, 90, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBS:', MARGIN_LEFT + 4, y + 5);
    pdf.setFont('helvetica', 'normal');
    doc.warnings.forEach((w, i) => {
      pdf.text(w, MARGIN_LEFT + 14, y + 5 + i * 5);
    });
    pdf.setTextColor(0);
    y += warningHeight + 6;
  }

  // ── Sections ──
  // Skip first section (header) since we rendered the title above
  const sections = doc.sections.slice(1);

  for (const section of sections) {
    // Check if we need a new page (at least 30mm needed for heading + some content)
    if (y > PAGE_HEIGHT - MARGIN_BOTTOM - 30) {
      pdf.addPage();
      y = MARGIN_TOP;
    }

    // Section heading
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 60, 94);
    pdf.text(section.heading, MARGIN_LEFT, y);
    y += 2;

    // Heading underline
    pdf.setDrawColor(30, 60, 94);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_WIDTH * 0.4, y);
    y += 6;

    // Section content — split into lines and handle wrapping
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(40);

    const contentLines = section.content.split('\n');

    for (const line of contentLines) {
      if (y > PAGE_HEIGHT - MARGIN_BOTTOM - 10) {
        pdf.addPage();
        y = MARGIN_TOP;
      }

      if (line.trim() === '') {
        y += 3; // blank line spacing
        continue;
      }

      // Bold lines that look like totals or labels
      const isBoldLine =
        line.startsWith('SUMMA') ||
        line.startsWith('BEHÅLLNING') ||
        line.startsWith('Ovanstående');
      if (isBoldLine) {
        pdf.setFont('helvetica', 'bold');
      }

      // Wrap long lines
      const wrapped = pdf.splitTextToSize(line, CONTENT_WIDTH - 5);
      for (const wl of wrapped) {
        if (y > PAGE_HEIGHT - MARGIN_BOTTOM - 10) {
          pdf.addPage();
          y = MARGIN_TOP;
        }
        pdf.text(wl, MARGIN_LEFT + 2, y);
        y += 5;
      }

      if (isBoldLine) {
        pdf.setFont('helvetica', 'normal');
      }
    }

    y += 6; // section gap
  }

  // ── Footer on every page ──
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150);
    pdf.text(
      'Utkast — Ska granskas av förrättningsmän och registreras hos Skatteverket',
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 12,
      { align: 'center' }
    );
    pdf.text(`Sida ${i} av ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 8, {
      align: 'center',
    });
  }

  // ── Download ──
  const safeName = (doc.title || 'bouppteckning')
    .replace(/[^a-zA-ZåäöÅÄÖ0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  pdf.save(`${safeName}.pdf`);
}
