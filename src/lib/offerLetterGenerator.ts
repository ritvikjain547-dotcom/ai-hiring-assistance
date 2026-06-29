import PDFDocument from 'pdfkit';

export interface OfferLetterData {
  candidateName: string;
  jobTitle: string;
  company: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  employmentType?: string;
  location?: string;
  locationType?: string;
  startDate?: string; // ISO date or readable string
  totalRoundsCleared?: number;
}

/**
 * Generate a professional PDF offer letter in-memory.
 * Returns a Buffer containing the PDF data.
 */
export async function generateOfferLetterPDF(data: OfferLetterData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        info: {
          Title: `Offer Letter - ${data.candidateName} - ${data.jobTitle}`,
          Author: data.company,
          Subject: 'Employment Offer Letter',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // --- Header with brand accent bar ---
      doc
        .rect(0, 0, doc.page.width, 8)
        .fill('#4f46e5');

      // Company name
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text(data.company, doc.page.margins.left, 40, { width: pageWidth });

      // Subtitle
      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#64748b')
        .text('OFFICIAL OFFER LETTER', { width: pageWidth });

      // Divider
      doc
        .moveDown(0.5)
        .strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();

      // Date
      doc
        .moveDown(1)
        .fontSize(10)
        .fillColor('#64748b')
        .text(`Date: ${formattedDate}`, { width: pageWidth });

      // Recipient
      doc
        .moveDown(1)
        .fontSize(11)
        .fillColor('#334155')
        .font('Helvetica-Bold')
        .text(`To: ${data.candidateName}`)
        .font('Helvetica')
        .moveDown(0.5)
        .text(`Subject: Offer of Employment — ${data.jobTitle}`)
        .moveDown(1.5);

      // Greeting
      doc
        .fontSize(11)
        .fillColor('#1e293b')
        .font('Helvetica')
        .text(`Dear ${data.candidateName},`, { width: pageWidth, lineGap: 4 });

      doc.moveDown(0.8);

      // Body paragraph 1
      doc.text(
        `We are pleased to extend this formal offer of employment for the position of `,
        { continued: true, lineGap: 4 }
      );
      doc.font('Helvetica-Bold').text(data.jobTitle, { continued: true });
      doc.font('Helvetica').text(` at `, { continued: true });
      doc.font('Helvetica-Bold').text(`${data.company}`, { continued: true });
      doc.font('Helvetica').text(
        `. After a thorough evaluation process${data.totalRoundsCleared ? ` spanning ${data.totalRoundsCleared} interview round${data.totalRoundsCleared > 1 ? 's' : ''}` : ''}, we are confident that your skills, experience, and professional qualities make you an excellent fit for our team.`,
        { lineGap: 4 }
      );

      doc.moveDown(0.8);

      // --- Employment Details Box ---
      const boxTop = doc.y;
      const boxPadding = 16;
      const lineHeight = 20;

      // Collect details
      const details: [string, string][] = [
        ['Position', data.jobTitle],
      ];

      if (data.employmentType) {
        details.push(['Employment Type', formatEmploymentType(data.employmentType)]);
      }
      if (data.location) {
        const locLabel = data.locationType ? `${data.location} (${formatLocationType(data.locationType)})` : data.location;
        details.push(['Location', locLabel]);
      }
      if (data.salaryMin || data.salaryMax) {
        const currency = data.salaryCurrency || 'USD';
        let salaryText: string;
        if (data.salaryMin && data.salaryMax) {
          salaryText = `${formatCurrency(data.salaryMin, currency)} — ${formatCurrency(data.salaryMax, currency)} per annum`;
        } else if (data.salaryMin) {
          salaryText = `${formatCurrency(data.salaryMin, currency)} per annum`;
        } else {
          salaryText = `Up to ${formatCurrency(data.salaryMax!, currency)} per annum`;
        }
        details.push(['Compensation', salaryText]);
      }

      const startDate = data.startDate || 'To be discussed';
      details.push(['Proposed Start Date', startDate]);

      const boxHeight = boxPadding * 2 + details.length * lineHeight + 8;

      // Draw box background
      doc
        .roundedRect(doc.page.margins.left, boxTop, pageWidth, boxHeight, 6)
        .fill('#f8fafc');

      // Box border
      doc
        .roundedRect(doc.page.margins.left, boxTop, pageWidth, boxHeight, 6)
        .strokeColor('#e2e8f0')
        .lineWidth(1)
        .stroke();

      // Box title
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#4f46e5')
        .text('EMPLOYMENT DETAILS', doc.page.margins.left + boxPadding, boxTop + boxPadding, {
          width: pageWidth - boxPadding * 2,
        });

      // Detail rows
      let detailY = boxTop + boxPadding + 20;
      for (const [label, value] of details) {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#475569')
          .text(`${label}:`, doc.page.margins.left + boxPadding, detailY, {
            width: 140,
            continued: false,
          });
        doc
          .font('Helvetica')
          .fillColor('#1e293b')
          .text(value, doc.page.margins.left + boxPadding + 145, detailY, {
            width: pageWidth - boxPadding * 2 - 145,
          });
        detailY += lineHeight;
      }

      doc.x = doc.page.margins.left;
      doc.y = boxTop + boxHeight + 16;

      // Terms section
      doc
        .fontSize(11)
        .fillColor('#1e293b')
        .font('Helvetica')
        .text(
          'This offer is contingent upon the successful completion of background verification and any other pre-employment checks as required by company policy. The detailed terms and conditions of your employment, including benefits, leave policies, and other specifics, will be outlined in a separate employment agreement that will be provided to you upon acceptance of this offer.',
          doc.page.margins.left,
          doc.y,
          { lineGap: 4, width: pageWidth }
        );

      doc.moveDown(0.8);

      // Acceptance instructions
      doc.text(
        'To accept this offer, please confirm your acceptance by responding to this email or logging into your dashboard on the AI Hiring Portal. We kindly request your response within 7 business days from the date of this letter.',
        { lineGap: 4, width: pageWidth }
      );

      doc.moveDown(0.8);

      // Closing
      doc.text(
        'We are excited about the possibility of you joining our team and believe you will make a significant contribution. Should you have any questions regarding this offer, please do not hesitate to reach out.',
        { lineGap: 4, width: pageWidth }
      );

      doc.moveDown(1.5);

      // Sign off
      doc.text('Warm regards,', { width: pageWidth });
      doc.moveDown(1.5);

      // Signature area
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(0.5)
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.margins.left + 200, doc.y)
        .stroke();

      doc.moveDown(0.5);

      doc
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text('Hiring Team', { width: pageWidth });
      doc
        .font('Helvetica')
        .fillColor('#64748b')
        .text(data.company, { width: pageWidth });

      // --- Footer ---
      const footerY = doc.page.height - doc.page.margins.bottom - 30;

      doc
        .strokeColor('#e2e8f0')
        .lineWidth(0.5)
        .moveTo(doc.page.margins.left, footerY)
        .lineTo(doc.page.width - doc.page.margins.right, footerY)
        .stroke();

      doc
        .fontSize(8)
        .fillColor('#94a3b8')
        .text(
          `This offer letter was generated by the AI Hiring Portal on behalf of ${data.company}. ` +
          `Ref: ${today.toISOString().slice(0, 10)}-${data.candidateName.replace(/\s+/g, '').slice(0, 8).toUpperCase()}`,
          doc.page.margins.left,
          footerY + 8,
          { width: pageWidth, align: 'center' }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function formatEmploymentType(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: 'Full-Time',
    PART_TIME: 'Part-Time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };
  return map[type] || type;
}

function formatLocationType(type: string): string {
  const map: Record<string, string> = {
    REMOTE: 'Remote',
    ONSITE: 'On-Site',
    HYBRID: 'Hybrid',
  };
  return map[type] || type;
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
