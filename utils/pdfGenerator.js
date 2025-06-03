const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateCatalog(outputPath = 'catalog.pdf') {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF into a file
    doc.pipe(fs.createWriteStream(outputPath));

    // Load the models data with forced reload
    const modelsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/models.json'), 'utf8'));

    // Set up the document
    doc.fontSize(25).text('Telecom Equipment Catalog', {
        align: 'center'
    });
    
    doc.moveDown();

    // Iterate through categories
    modelsData.categories.forEach(category => {
        // Add category header
        doc.fontSize(20)
           .fillColor('#2c3e50')
           .text(category.name);
        
        doc.moveDown();

        // Add products in the category
        category.products.forEach(product => {
            // Product name
            doc.fontSize(16)
               .fillColor('#34495e')
               .text(product.name);

            // Product description
            doc.fontSize(12)
               .fillColor('#7f8c8d')
               .text(product.description);

            // Product ID
            doc.fontSize(10)
               .fillColor('#95a5a6')
               .text(`ID: ${product.id}`);

            doc.moveDown();
        });

        doc.moveDown();
    });

    // Finalize the PDF
    doc.end();

    return outputPath;
}

module.exports = {
    generateCatalog
}; 