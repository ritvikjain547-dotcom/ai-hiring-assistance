import { generateOfferLetterPDF } from './src/lib/offerLetterGenerator';
import * as fs from 'fs';
import * as path from 'path';

async function testOfferLetter() {
  console.log('Generating test offer letter PDF...');
  
  const pdfBuffer = await generateOfferLetterPDF({
    candidateName: 'Ritvik Jain',
    jobTitle: 'Database Engineer',
    company: 'TechCorp Solutions',
    salaryMin: 80000,
    salaryMax: 120000,
    salaryCurrency: 'USD',
    employmentType: 'FULL_TIME',
    location: 'Bangalore, India',
    locationType: 'HYBRID',
    totalRoundsCleared: 3,
  });

  const outputPath = path.join(__dirname, 'test-offer-letter.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`✅ PDF generated successfully! (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`📄 Saved to: ${outputPath}`);
  console.log('Open this file to verify the offer letter looks correct.');
}

testOfferLetter().catch(console.error);
