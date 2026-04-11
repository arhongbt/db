// ============================================================
// Bodelningsavtal Generator (sambo + gift)
// Generates a .docx bodelningsavtal using docx-js
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
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  LevelFormat,
} from 'docx';

// ── Types ──

export interface SamboEgendom {
  id: string;
  beskrivning: string;
  typ: 'bostad' | 'bohag';
  varde: number;
  agareSambo: boolean; // true = sambon äger, false = den avlidne ägde
}

export interface BodelningsData {
  // Parties
  deceasedName: string;
  deceasedPersonnummer: string;
  samboName: string;
  samboPersonnummer: string;

  // Samboegendom
  egendom: SamboEgendom[];

  // Dates
  dödsdatum: string;
  avtalsDatum: string;

  // Type
  typ: 'sambo' | 'gift';
}

// ── Constants ──
const BRAND = '2C4A6E';
const PAGE_WIDTH = 11906;
const MARGIN = 1440;
const CW = PAGE_WIDTH - MARGIN * 2;

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellPad = { top: 60, bottom: 60, left: 100, right: 100 };

function formatSEK(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Main export ──

export async function downloadBodelningsavtal(data: BodelningsData): Promise<void> {
  const children: Paragraph[] = [];

  // ── Title ──
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'BODELNINGSAVTAL',
          bold: true,
          size: 36,
          font: 'Arial',
          color: BRAND,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.typ === 'sambo'
            ? 'Enligt Sambolagen (2003:376)'
            : 'Enligt Äktenskapsbalken (1987:230)',
          size: 22,
          font: 'Arial',
          color: '666666',
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Avtalsdatum: ${data.avtalsDatum}`,
          size: 20,
          font: 'Arial',
          color: '999999',
        }),
      ],
    })
  );

  // ── Section 1: Parter ──
  children.push(sectionHeading('1. PARTER'));

  children.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({ text: 'Den avlidne: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({
          text: `${data.deceasedName} (${data.deceasedPersonnummer})`,
          size: 22,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'Avliden: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({ text: data.dödsdatum, size: 22, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.typ === 'sambo' ? 'Efterlevande sambo: ' : 'Efterlevande make/maka: ',
          bold: true,
          size: 22,
          font: 'Arial',
        }),
        new TextRun({
          text: `${data.samboName} (${data.samboPersonnummer})`,
          size: 22,
          font: 'Arial',
        }),
      ],
    })
  );

  // ── Section 2: Bakgrund ──
  children.push(sectionHeading('2. BAKGRUND'));

  if (data.typ === 'sambo') {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({
            text: 'Parterna har sammanbott som sambor. Med anledning av sambof' +
              '\u00f6rh\u00e5llandets upph\u00f6rande genom d\u00f6dsfall har den efterlevande sambon beg' +
              '\u00e4rt bodelning enligt Sambolagen (2003:376). Bodelningen avser samboegendom, ' +
              'det vill s\u00e4ga gemensam bostad och bohag som f\u00f6rv\u00e4rvats f\u00f6r gemensamt bruk.',
            size: 22,
            font: 'Arial',
          }),
        ],
      })
    );
  } else {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({
            text: 'Parterna var gifta. Med anledning av \u00e4ktenskapets uppl\u00f6sning genom d\u00f6dsfall ' +
              'ska bodelning av giftor\u00e4ttsgods g\u00f6ras enligt \u00c4ktenskapsbalken (1987:230).',
            size: 22,
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // ── Section 3: Samboegendom / Giftorättsgods ──
  const egendomLabel = data.typ === 'sambo' ? 'SAMBOEGENDOM' : 'GIFTORÄTT SGODS';
  children.push(sectionHeading(`3. ${egendomLabel}`));

  if (data.egendom.length > 0) {
    // Group by type
    const bostader = data.egendom.filter((e) => e.typ === 'bostad');
    const bohag = data.egendom.filter((e) => e.typ === 'bohag');

    if (bostader.length > 0) {
      children.push(subHeading('Gemensam bostad'));
      children.push(egendomTable(bostader) as unknown as Paragraph);
      children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }

    if (bohag.length > 0) {
      children.push(subHeading('Gemensamt bohag'));
      children.push(egendomTable(bohag) as unknown as Paragraph);
      children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }
  }

  // ── Section 4: Beräkning ──
  children.push(sectionHeading('4. BERÄKNING'));

  const totalVarde = data.egendom.reduce((s, e) => s + e.varde, 0);
  const halfShare = Math.round(totalVarde / 2);

  children.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: `Totalt v\u00e4rde av ${data.typ === 'sambo' ? 'samboegendom' : 'giftor\u00e4ttsgods'}: `,
          size: 22,
          font: 'Arial',
        }),
        new TextRun({
          text: formatSEK(totalVarde),
          bold: true,
          size: 22,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `Efterlevande ${data.typ === 'sambo' ? 'sambons' : 'makens/makans'} andel (50 %): `,
          size: 22,
          font: 'Arial',
        }),
        new TextRun({ text: formatSEK(halfShare), bold: true, size: 22, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `D\u00f6dsboets andel (50 %): `,
          size: 22,
          font: 'Arial',
        }),
        new TextRun({
          text: formatSEK(totalVarde - halfShare),
          bold: true,
          size: 22,
          font: 'Arial',
        }),
      ],
    })
  );

  // ── Section 5: Överenskommelse ──
  children.push(sectionHeading('5. ÖVERENSKOMMELSE'));

  children.push(
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: 'Parterna \u00e4r \u00f6verens om att bodelningen ska genomf\u00f6ras i enlighet med ovanst\u00e5ende ber\u00e4kning. ' +
            'Genom undertecknande av detta avtal f\u00f6rklarar parterna att bodelningen \u00e4r slutgiltig och att ingen av parterna ' +
            'har ytterligare anspr\u00e5k p\u00e5 den andres egendom avseende denna bodelning.',
          size: 22,
          font: 'Arial',
        }),
      ],
    })
  );

  // ── Section 6: Tidsfrister ──
  if (data.typ === 'sambo') {
    children.push(sectionHeading('6. TIDSFRISTER'));
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({
            text: 'Enligt Sambolagen 8 \u00a7 m\u00e5ste en beg\u00e4ran om bodelning g\u00f6ras senast ett \u00e5r efter det att ' +
              'sambof\u00f6rh\u00e5llandet upph\u00f6rde. Vid d\u00f6dsfall r\u00e4knas denna tidsfrist fr\u00e5n d\u00f6dsdatumet.',
            size: 22,
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // ── Signatures ──
  const sigSection = data.typ === 'sambo' ? '7' : '6';
  children.push(sectionHeading(`${sigSection}. UNDERSKRIFTER`));

  children.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: 'Ort och datum: ______________________________',
          size: 22,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 300 }, children: [] }),
    new Paragraph({
      spacing: { after: 20 },
      children: [
        new TextRun({ text: '________________________________', size: 22, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `F\u00f6r d\u00f6dsboet efter ${data.deceasedName}`,
          size: 20,
          font: 'Arial',
          color: '666666',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 20 },
      children: [
        new TextRun({ text: '________________________________', size: 22, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${data.samboName}`,
          size: 20,
          font: 'Arial',
          color: '666666',
        }),
      ],
    })
  );

  // ── Build document ──
  const document = new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
    },
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
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
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Bodelningsavtal',
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
                  new TextRun({ text: 'Sida ', size: 16, font: 'Arial', color: '999999' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Arial', color: '999999' }),
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
  a.download = `bodelningsavtal_${new Date().toISOString().slice(0, 10)}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ──

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND, space: 4 },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        font: 'Arial',
        color: BRAND,
      }),
    ],
  });
}

function subHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        font: 'Arial',
        color: '333333',
      }),
    ],
  });
}

function egendomTable(items: SamboEgendom[]): Table {
  const descW = Math.round(CW * 0.5);
  const ownerW = Math.round(CW * 0.25);
  const valW = CW - descW - ownerW;

  const headerRow = new TableRow({
    children: [
      headerCell('Beskrivning', descW),
      headerCell('Ägare', ownerW),
      headerCell('Värde', valW),
    ],
  });

  const dataRows = items.map(
    (item, idx) =>
      new TableRow({
        children: [
          dataCell(item.beskrivning, descW, idx),
          dataCell(item.agareSambo ? 'Sambon' : 'Den avlidne', ownerW, idx),
          dataCell(formatSEK(item.varde), valW, idx, AlignmentType.RIGHT),
        ],
      })
  );

  const totalVal = items.reduce((s, i) => s + i.varde, 0);
  const totalRow = new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: descW + ownerW, type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: BRAND, type: ShadingType.CLEAR },
        columnSpan: 2,
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Summa', bold: true, size: 20, font: 'Arial', color: 'FFFFFF' }),
            ],
          }),
        ],
      }),
      new TableCell({
        borders,
        width: { size: valW, type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: BRAND, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: formatSEK(totalVal),
                bold: true,
                size: 20,
                font: 'Arial',
                color: 'FFFFFF',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [descW, ownerW, valW],
    rows: [headerRow, ...dataRows, totalRow],
  });
}

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: cellPad,
    shading: { fill: 'E8EFF5', type: ShadingType.CLEAR },
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, size: 20, font: 'Arial', color: '333333' }),
        ],
      }),
    ],
  });
}

function dataCell(
  text: string,
  width: number,
  idx: number,
  align?: (typeof AlignmentType)[keyof typeof AlignmentType]
): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: cellPad,
    shading: idx % 2 === 0 ? { fill: 'F8F9FA', type: ShadingType.CLEAR } : undefined,
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text, size: 20, font: 'Arial' })],
      }),
    ],
  });
}
