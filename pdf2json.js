let fs = require('fs'),
    PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
  pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFile("./pdf2json/F1040EZ.json", JSON.stringify(pdfData));
    console.log(pdfParser);
});

pdfParser.loadPDF("./pdf/champdieu2018rglt.pdf");

/*
var monSet = new Set();

// Get content from file
var contents = fs.readFileSync("./pdf2json/F1040EZ.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);
for (var i = 0; i < jsonContent.formImage['Pages'].length; i++){
    var obj = jsonContent.formImage['Pages'][i];
    for (var j = 0; j < obj['Texts'].length; j++){
      monSet.add(obj['Texts'][j]['x']);
    }
}
*/
