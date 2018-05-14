var cheerio = require('cheerio');
var request = require('request');
var jsonframe = require('jsonframe-cheerio');

var $navInfo = [];
$navInfo['page'] = {};
$navInfo['page']['currentPage'] = 'https://www.leboncoin.fr/ventes_immobilieres/offres/alsace/?o=1&location=Riedisheim%2068400';
$navInfo['page']['path_liste_articles'] = '.list_item';
$navInfo['page']['path_url_article'] = 'a';
$navInfo['page']['path_url_next_page'] = '[id=next]';

let frame = {
    "title": "h1",
	"prix": "[itemprop=price] @ content",
	"piece": ".property:contains('Pièces') + span",
	"surface": ".property:contains('Surface') + span",
	"ges": ".property:contains('GES') + span",
	"class_energie": ".property:contains('Classe énergie') + span"
}

// inteval avant dappeler une page suivante
var $timeinterval = 5000; // 5s

// start with openning the start page
parser_page($navInfo, $timeinterval);

/*
- Get liste articles de l'URL $current_url using $path_liste_articles
	-- for each PARSE_DETAIL()
- Recherche URL using $path_URL_next_page --> $next_page
	-- appel fonction PARSER_PAGE ($next_page, $path_URL_next_page)
*/
function parser_page(navInfo, $timeinterval){

	request(navInfo['page']['currentPage'], function (error, response, html) {
	  if (!error && response.statusCode == 200) {
		// parsing the html page with cheerio
		let $ = cheerio.load(html);
		
		let articles = $(navInfo['page']['path_liste_articles']);
		//let nextPage = $(navInfo['page']['path_url_next_page']);
		
		articles.each(function(index, element){
			let navInfoArticle = copyArray(navInfo);
			navInfoArticle['page']['currentPage'] = 'https:' + $(element).attr('href');
			setTimeout(function(){parser_article(navInfoArticle)}, $timeinterval*index);
		});
/*
		if(typeof nextPage != 'undefined' && nextPage.attr('href') != 'undefined'){
			console.log('[DEBUG] Next page find: ' + 'https:' + nextPage.attr('href'));
			let navInfoNextPage = copyArray(navInfo);
			navInfoNextPage['page']['currentPage'] = 'https:' + nextPage.attr('href');
			parser_page(navInfoNextPage, $timeinterval);
		}
*/
	  }
	});
}

function parser_article(navInfo){
	console.log('[DEBUG] Open article URL: ' + navInfo['page']['currentPage']);
	request(navInfo['page']['currentPage'], function (error, response, html) {
		if (!error && response.statusCode == 200) {
			let $ = cheerio.load(html);
			// initializes the jsonframe-cheerio plugin
			jsonframe($);
			
			let ventes =  $('body').scrape(frame);
			console.log(ventes);
		}
	});
}

function copyArray(mArr){
	var $newArr = [];
	Object.keys(mArr).forEach(function(key,index) {
		$newArr[key] = {};
		Object.keys(mArr[key]).forEach(function(key2d,index2d) {
			$newArr[key][key2d] = mArr[key][key2d];
		});
	});
	
	return $newArr;
}