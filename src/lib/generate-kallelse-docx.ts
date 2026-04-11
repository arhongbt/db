// ============================================================
// Kallelse till Bouppteckningsförrättning — DOCX Generator
// ============================================================

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber, LevelFormat,
} from 'docx';

const BRAND = '2C4A6E';
const PW = 11906;
const M = 1440;
const CW = PW - M * 2;

interface KallelseData {
  deceasedName: string;
  personnummer: string;
  deathDate: string;
  forrattningsDatum: string;
  forrattningsTid: string;
  forrattningsPlats: string;
  delagare: { name: string; relation?: string }[];
  forrattningsman: { name: string }[];
  bouppgivare: string;
  kallelseDatum: string;
}

export async function downloadKallelseDocx(data: KallelseData): Promise<void> {
  const c: Paragraph[] = [];

  // Title
  c.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({ text: 'KALLELSE TILL', bold: true, size: 32, font: 'Arial', color: BRAND }),
        new TextRun({ text: '', break: 1 }),
        new TextRun({ text: 'BOUPPTECKNINGSF\u00d6RR\u00c4TTNING', bold: true, size: 32, font: 'Arial', color: BRAND }),
      ],
    })
  );

  // Deceased info
  c.push(sectionLine('D\u00f6dsbo efter'));
  c.push(fieldRow('Namn', data.deceasedName));
  c.push(fieldRow('Personnummer', data.personnummer));
  c.push(fieldRow('Avliden', data.deathDate));
  c.push(spacer());

  // Förrättning details
  c.push(sectionLine('F\u00f6rr\u00e4ttning'));
  c.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: 'Ni kallas h\u00e4rmed till bouppteckningsf\u00f6rr\u00e4ttning enligt 20 kap. 2 \u00a7 \u00e4rvdabalken.',
          size: 22, font: 'Arial',
        }),
      ],
    })
  );

  // Details table
  const lw = Math.round(CW * 0.25);
  const vw = CW - lw;
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
  const pad = { top: 60, bottom: 60, left: 100, right: 100 };

  const detailRows = [
    ['Datum', data.forrattningsDatum],
    ['Tid', data.forrattningsTid],
    ['Plats', data.forrattningsPlats],
  ].map(
    ([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders, width: { size: lw, type: WidthType.DXA }, margins: pad,
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, font: 'Arial', color: '555555' })] })],
          }),
          new TableCell({
            borders: noBorders, width: { size: vw, type: WidthType.DXA }, margins: pad,
            children: [new Paragraph({ children: [new TextRun({ text: value, size: 22, font: 'Arial' })] })],
          }),
        ],
      })
  );

  c.push(
    new Table({
      width: { size: CW, type: WidthType.DXA },
      columnWidths: [lw, vw],
      rows: detailRows,
    }) as unknown as Paragraph
  );
  c.push(spacer());

  // Kallade dödsbodelägare
  c.push(sectionLine('Kallade d\u00f6dsbo del\u00e4gare'));
  if (data.delagare.length > 0) {
    for (const d of data.delagare) {
      c.push(
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [
            new TextRun({ text: d.name, size: 22, font: 'Arial' }),
            ...(d.relation === 'make_maka'
              ? [new TextRun({ text: ' (efterlevande make/maka)', size: 20, font: 'Arial', color: '666666', italics: true })]
              : []),
          ],
        })
      );
    }
  } else {
    c.push(new Paragraph({ children: [new TextRun({ text: '[Inga d\u00f6dsbodel\u00e4gare registrerade]', size: 22, font: 'Arial', color: '999999', italics: true })] }));
  }
  c.push(spacer());

  // Förrättningsmän
  c.push(sectionLine('F\u00f6rr\u00e4ttningsm\u00e4n'));
  if (data.forrattningsman.length > 0) {
    for (const f of data.forrattningsman) {
      c.push(
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: f.name, size: 22, font: 'Arial' })],
        })
      );
    }
  } else {
    c.push(new Paragraph({ children: [new TextRun({ text: '[Ej angivna]', size: 22, font: 'Arial', color: '999999', italics: true })] }));
  }

  c.push(fieldRow('Bouppgivare', data.bouppgivare));
  c.push(spacer());

  // Info section
  c.push(sectionLine('Information till kallade'));

  const infoItems = [
    'Vid f\u00f6rr\u00e4ttningen ska d\u00f6dsboets samtliga tillg\u00e5ngar och skulder per d\u00f6dsdagen g\u00e5s igenom och antecknas.',
    'Du beh\u00f6ver inte n\u00e4rvara personligen \u2014 du kan skicka ombud med skriftlig fullmakt eller l\u00e4mna skriftligt godk\u00e4nnande i f\u00f6rv\u00e4g.',
    'Om du inte kan n\u00e4rvara, meddela detta till kontaktpersonen nedan s\u00e5 snart som m\u00f6jligt.',
    'Ta med eventuella handlingar som r\u00f6r den avlidnes tillg\u00e5ngar eller skulder (saldobesked, v\u00e4rdeintyg, l\u00e5nehandlingar m.m.).',
  ];

  for (const item of infoItems) {
    c.push(
      new Paragraph({
        numbering: { reference: 'numbers', level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: item, size: 20, font: 'Arial' })],
      })
    );
  }
  c.push(spacer());

  // Contact section
  c.push(sectionLine('Kontaktperson'));
  c.push(fieldRow('Namn', '____________________________'));
  c.push(fieldRow('Telefon', '____________________________'));
  c.push(fieldRow('E-post', '____________________________'));
  c.push(spacer());

  c.push(
    new Paragraph({
      spacing: { before: 200 },
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: `Kallelsen skickad: ${data.kallelseDatum}`, size: 20, font: 'Arial', color: '999999', italics: true }),
      ],
    })
  );

  c.push(
    new Paragraph({
      spacing: { before: 300 },
      shading: { fill: 'F5F5F5', type: ShadingType.CLEAR },
      children: [
        new TextRun({
          text: 'Kallelsen ska skickas ut i god tid f\u00f6re f\u00f6rr\u00e4ttningen (minst 2 veckor rekommenderas). '
            + 'Kallelsen ska skickas till ALLA d\u00f6dsbodel\u00e4gare, \u00e4ven de som inte f\u00f6rv\u00e4ntas \u00e4rva.',
          size: 18, font: 'Arial', color: '666666', italics: true,
        }),
      ],
    })
  );

  // Build document
  const doc = new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
        },
        {
          reference: 'numbers',
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: PW, height: 16838 },
          margin: { top: M, right: M, bottom: M, left: M },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'Kallelse till f\u00f6rr\u00e4ttning', size: 16, font: 'Arial', color: '999999', italics: true })],
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
      children: c,
    }],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const a = globalThis.document.createElement('a');
  a.href = url;
  a.download = `kallelse_${new Date().toISOString().slice(0, 10)}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// Helpers
function sectionLine(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND, space: 4 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: 'Arial', color: BRAND })],
  });
}

function fieldRow(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, font: 'Arial', color: '555555' }),
      new TextRun({ text: value, size: 22, font: 'Arial' }),
    ],
  });
}

function spacer(): Paragraph {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}
