// ============================================================
// Generic Document DOCX Generator
// Converts plain text documents to professional .docx files
// Used for fullmakter, brev, and other text templates
// ============================================================

import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
  Header, Footer, PageNumber,
} from 'docx';

const BRAND = '2C4A6E';

export async function downloadDocumentDocx(
  title: string,
  content: string,
  filename: string
): Promise<void> {
  const lines = content.split('\n');
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND, space: 8 } },
      children: [
        new TextRun({ text: title.toUpperCase(), bold: true, size: 30, font: 'Arial', color: BRAND }),
      ],
    })
  );

  // Content lines
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip the first line if it matches the title
    if (trimmed.toUpperCase() === title.toUpperCase()) continue;

    // Section dividers
    if (trimmed.startsWith('\u2500') || trimmed.startsWith('---')) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC', space: 4 } },
          children: [],
        })
      );
      continue;
    }

    // Empty lines
    if (trimmed === '') {
      children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
      continue;
    }

    // Underline placeholders (______)
    const isSignatureLine = trimmed.startsWith('____');

    // All-caps lines are likely headings
    const isHeading = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /[A-ZÅÄÖ]/.test(trimmed);

    if (isHeading && !isSignatureLine) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({ text: trimmed, bold: true, size: 24, font: 'Arial', color: BRAND }),
          ],
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: line, size: 22, font: 'Arial' }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: title, size: 16, font: 'Arial', color: '999999', italics: true })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Sida ', size: 16, font: 'Arial', color: '999999' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Arial', color: '999999' }),
            ],
          })],
        }),
      },
      children,
    }],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const a = globalThis.document.createElement('a');
  a.href = url;
  a.download = `${filename.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
