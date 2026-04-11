// ============================================================
// Bouppteckning DOCX Generator (client-side)
// Generates a Skatteverket-style .docx using docx-js
// ============================================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  LevelFormat,
} from 'docx';
import type {
  BouppteckningDocument,
  BouppteckningSection,
} from './generate-bouppteckning';

// ── Constants ──
const BRAND_COLOR = '2C4A6E';
const LIGHT_BG = 'E8EFF5';
const BORDER_COLOR = 'CCCCCC';
const PAGE_WIDTH = 11906; // A4 DXA
const MARGIN = 1440; // 1 inch
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2; // ~9026 DXA

const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: BORDER_COLOR,
};
const borders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
};
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

// ── Main export function ──

export async function downloadBouppteckningDocx(
  doc: BouppteckningDocument
): Promise<void> {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'BOUPPTECKNING',
          bold: true,
          size: 36,
          font: 'Arial',
          color: BRAND_COLOR,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: doc.title,
          size: 24,
          font: 'Arial',
          color: '444444',
        }),
      ],
    })
  );

  // Warnings
  if (doc.warnings.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: 'OBS! Följande uppgifter saknas:',
            bold: true,
            size: 20,
            font: 'Arial',
            color: 'CC0000',
          }),
        ],
      })
    );
    for (const w of doc.warnings) {
      children.push(
        new Paragraph({
          numbering: { reference: 'warnings', level: 0 },
          children: [
            new TextRun({ text: w, size: 20, font: 'Arial', color: 'CC0000' }),
          ],
        })
      );
    }
    children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  }

  // Sections
  for (const section of doc.sections) {
    children.push(...renderSection(section));
  }

  // Generated timestamp
  children.push(
    new Paragraph({
      spacing: { before: 400 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Genererad: ${new Date(doc.generatedAt).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          size: 18,
          font: 'Arial',
          color: '999999',
          italics: true,
        }),
      ],
    })
  );

  const document = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 22 } },
      },
    },
    numbering: {
      config: [
        {
          reference: 'warnings',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: 16838 },
            margin: {
              top: MARGIN,
              right: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Bouppteckning',
                    size: 16,
                    font: 'Arial',
                    color: '999999',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Sida ',
                    size: 16,
                    font: 'Arial',
                    color: '999999',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    font: 'Arial',
                    color: '999999',
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(document);
  const url = URL.createObjectURL(buffer);
  const a = globalThis.document.createElement('a');
  a.href = url;
  a.download = `bouppteckning_${new Date().toISOString().slice(0, 10)}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Section renderer ──

function renderSection(section: BouppteckningSection): Paragraph[] {
  const items: Paragraph[] = [];

  // Section heading with brand color bottom border
  items.push(
    new Paragraph({
      spacing: { before: 300, after: 120 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: BRAND_COLOR,
          space: 4,
        },
      },
      children: [
        new TextRun({
          text: section.heading,
          bold: true,
          size: 24,
          font: 'Arial',
          color: BRAND_COLOR,
        }),
      ],
    })
  );

  // Fields as a clean two-column table
  if (section.fields && section.fields.length > 0) {
    const labelWidth = Math.round(CONTENT_WIDTH * 0.35);
    const valueWidth = CONTENT_WIDTH - labelWidth;

    items.push(
      new Paragraph({
        children: [],
        spacing: { after: 40 },
      })
    );

    const fieldTable = new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [labelWidth, valueWidth],
      rows: section.fields.map(
        ([label, value], idx) =>
          new TableRow({
            children: [
              new TableCell({
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: 'EEEEEE',
                  },
                  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                },
                width: { size: labelWidth, type: WidthType.DXA },
                margins: cellMargins,
                shading:
                  idx % 2 === 0
                    ? { fill: LIGHT_BG, type: ShadingType.CLEAR }
                    : undefined,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: label,
                        bold: true,
                        size: 20,
                        font: 'Arial',
                        color: '333333',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: 'EEEEEE',
                  },
                  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                },
                width: { size: valueWidth, type: WidthType.DXA },
                margins: cellMargins,
                shading:
                  idx % 2 === 0
                    ? { fill: LIGHT_BG, type: ShadingType.CLEAR }
                    : undefined,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: value,
                        size: 20,
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    });

    // Cast to any to push table alongside paragraphs
    items.push(fieldTable as unknown as Paragraph);
  }

  // Table rows (tillgångar, skulder, etc.)
  if (section.tableRows && section.tableRows.length > 0) {
    const descWidth = Math.round(CONTENT_WIDTH * 0.7);
    const valWidth = CONTENT_WIDTH - descWidth;

    const rows = section.tableRows.map(
      ([desc, val], idx) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: descWidth, type: WidthType.DXA },
              margins: cellMargins,
              shading:
                idx % 2 === 0
                  ? { fill: LIGHT_BG, type: ShadingType.CLEAR }
                  : undefined,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: desc,
                      size: 20,
                      font: 'Arial',
                      bold: desc.startsWith('\u2500'),
                      color: desc.startsWith('\u2500') ? BRAND_COLOR : '333333',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: valWidth, type: WidthType.DXA },
              margins: cellMargins,
              shading:
                idx % 2 === 0
                  ? { fill: LIGHT_BG, type: ShadingType.CLEAR }
                  : undefined,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: val,
                      size: 20,
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    );

    // Total row
    if (section.totalRow) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: descWidth, type: WidthType.DXA },
              margins: cellMargins,
              shading: { fill: BRAND_COLOR, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: section.totalRow[0],
                      bold: true,
                      size: 22,
                      font: 'Arial',
                      color: 'FFFFFF',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: valWidth, type: WidthType.DXA },
              margins: cellMargins,
              shading: { fill: BRAND_COLOR, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: section.totalRow[1],
                      bold: true,
                      size: 22,
                      font: 'Arial',
                      color: 'FFFFFF',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }

    items.push(
      new Paragraph({ children: [], spacing: { after: 40 } })
    );
    items.push(
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [descWidth, valWidth],
        rows,
      }) as unknown as Paragraph
    );
  }

  // Free text content
  if (section.content) {
    const lines = section.content.split('\n');
    for (const line of lines) {
      items.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: line,
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
    }
  }

  // Standalone total row (no table, e.g. Behållning)
  if (section.totalRow && !section.tableRows) {
    items.push(
      new Paragraph({
        spacing: { before: 120 },
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: BRAND_COLOR,
            space: 4,
          },
        },
        children: [
          new TextRun({
            text: `${section.totalRow[0]}: `,
            bold: true,
            size: 26,
            font: 'Arial',
            color: BRAND_COLOR,
          }),
          new TextRun({
            text: section.totalRow[1],
            bold: true,
            size: 26,
            font: 'Arial',
          }),
        ],
      })
    );
  }

  return items;
}
