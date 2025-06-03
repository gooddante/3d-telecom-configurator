const { generateCatalog } = require('../utils/pdfGenerator');

// Generate the catalog
const outputPath = generateCatalog('telecom-catalog.pdf');
console.log(`PDF catalog has been generated at: ${outputPath}`); 