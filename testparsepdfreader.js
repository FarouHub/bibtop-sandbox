var fs = require("fs");
var pdfreader = require("pdfreader");

var regexChiffre = /^.*([0-9]*).*$/g;

var rules = [
    //pdfreader.Rule.on(/^Hello \"(.*)\"$/).extractRegexpValues().then(displayValue),
    //pdfreader.Rule.on(/^Value\:/).parseNextItemValue().then(displayValue),
    //pdfreader.Rule.on(/^c1$/).parseTable(3).then(displayTable),
    pdfreader.Rule.on(/inscription/i).parseNextItemValue().then(displayValue)
];

function displayValue(value){
    console.log("extracted value:", value);
}
function displayTable(table){
    for (var i=0; i<table.length; ++i)
        console.log(table[i].join("\t"));
}

var processItem = pdfreader.Rule.makeItemProcessor(rules);

new pdfreader.PdfReader().parseFileItems("./pdf/stchamond2018rglt.pdf", function(err, item){
    if(err){
        console.log(err);
    }else{
        processItem(item);
    }
});