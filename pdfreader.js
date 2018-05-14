var fs = require("fs");
var pdfreader = require("pdfreader");

/* ------------------ */
var rows = {}; // indexed by y-position 
var tmp_x = null;
var tmp_end_space = false;

new pdfreader.PdfReader().parseFileItems('./pdf/stchamond2018rglt.pdf', function(err, item){
  if (!item || item.page) {
    // end of file, or page 
    //getText();
    printText();
    //console.log('PAGE:', item.page);
    rows = {}; // clear rows for next page 
  } else if (item.text) {

    /*
    let spacer = '';
    
    if(!tmp_end_space && tmp_x != null && tmp_x < item.x && (item.x - tmp_x) >= item.sw*0.8){
      spacer = '#';
    }
    */
    //console.log(item.y + ';' + item.x.replace('.', ',') + ';=F2*$I$1+B2;' + (item.x-tmp_x) + ';' + item.text  + ';'+ item.text.length);

    // next distance word
    /*
    tmp_end_space = item.text[item.text.length-1] === ' ';
    tmp_x = item.text.length * item.sw + item.x;
    */
    /*
    if(item.text.indexOf("'") != -1 || item.text.indexOf("’") != -1){
      tmp_x -= item.sw*(0.5);
    }
    */
    // accumulate text items into rows object, per line 
    (rows[item.y] = rows[item.y] || []).push( item.text );
  }
});

function extractData(line, regex){
  let result = line.match(new RegExp(regex,"gi"));
  let find = false;
  if(result){
    find = true;
    result = result.join('');
    result = result.replace(/\s{2,}/g, ' ');
    console.log(result);
  }

  return find;
}

var distance = null;
var tmp_y = null;

function printText(){
  Object.keys(rows) // => array of y-positions (type: float) 
  .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions 
  .forEach((y) => {

    if(tmp_y == null){
      tmp_y = y;
    }else if(distance == null){
      distance = y - tmp_y;
      tmp_y = y;
    }else{
      if((y - tmp_y - 0.2) > distance){
        //console.log("# -----New Distance: "+ (y - tmp_y) +"--------Distance: "+ distance +"--------------- #"); 
        console.log("");
      }
      distance = y - tmp_y;
      tmp_y = y;
    }

    console.log((rows[y] || []).join(''));

  });
}

function getText(){
  Object.keys(rows) // => array of y-positions (type: float) 
  .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions 
  .forEach((y) => {
    let ligne = (rows[y] || []).join('');
    let find = extractData(ligne, '^.*trail.*$');
    if(!find){
      find = extractData(ligne, '^.*course.*$');
    }
    if(!find){
      find = extractData(ligne, '^.*départ.*$'); 
    }
    if(!find){
      find = extractData(ligne, '^.*inscription.*$'); 
    }
    if(!find){
      find = extractData(ligne, '^.*ravit.*$'); 
    }
    if(!find){
      find = extractData(ligne, '^.*dossard.*$'); 
    }
  });
  return '';
}
