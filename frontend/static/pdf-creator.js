import './Roboto-Regular-normal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const startX = 20;
const startY = 30;
const lineColor = 170;
const lineWidth = 0.1;

export function createReport(report, tableHtmlTag) {
  const doc = new jsPDF();
  doc.setFont('Roboto-Regular');
  let y = startY;

  if (report?.title) {
    doc.setFontSize(18);
    doc.text(report.title, startX, y);
    y += 8;
  }

  if (report?.subtitle) {
    doc.setFontSize(14);
    doc.text(report.subtitle, startX, y);
    y += 12;
  }

  if (report?.data) {
    doc.setFontSize(14);
    report.data.forEach((item) => {
      doc.text(item, startX, y);
      y += 8;
    });
  }

  if (tableHtmlTag) {
    doc.autoTable({
      html: tableHtmlTag,
      startY: y - 4,
      styles: {
        font: 'Roboto-Regular',
        fontSize: 12,
        textColor: 0,
        lineColor,
        lineWidth,
        fillColor: 255,
      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: 235,
        textColor: 0,
      },
      theme: 'grid',
      margin: { left: startX, right: startX },
    });
  }

  includeHeader(doc);
  window.open(doc.output('bloburl'));
}

function includeHeader(doc) {
  doc.setFontSize(12);
  doc.setTextColor(130);
  doc.text('Сервис междугородных перевозок', startX, 10);
  doc.text('Тел.: 8 (979) 636-66-36', 210 - startX, 10, { align: 'right' });

  doc.setLineWidth(lineWidth);
  doc.setDrawColor(lineColor);
  doc.line(startX, 15, 210 - startX, 15);
}
