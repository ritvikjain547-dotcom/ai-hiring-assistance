import PDFParser from "pdf2json";

async function testPdf2json() {
  const dummyBuffer = Buffer.from(
    "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 5 0 R\n>>\n>>\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\n5 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000224 00000 n \n0000000318 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n405\n%%EOF\n"
  );
  
  const pdfParser = new PDFParser(null, 1);
  
  pdfParser.on("pdfParser_dataError", (errData: any) => console.error("Error:", errData.parserError));
  pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
    console.log("Extracted:", pdfParser.getRawTextContent());
  });
  
  pdfParser.parseBuffer(dummyBuffer);
}

testPdf2json();
