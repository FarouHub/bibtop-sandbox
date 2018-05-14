var fs = require("fs");
var pdfreader = require("pdfreader");


new pdfreader.PdfReader().parseFileItems("./pdf/champdieu2018rglt.pdf", function(err, item){
    console.log('y: ' + item.y + 'x: ' + item.x + 't: ' + item.text);
});