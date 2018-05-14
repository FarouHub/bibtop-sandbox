var cheerio = require('cheerio');
var request = require('request');
var jsonframe = require('jsonframe-cheerio');
var MongoClient = require("mongodb").MongoClient;

/* Info de navigation */
var $navInfo = {};

$navInfo['rootPage'] = 'http://www.jogging-international.net';
$navInfo['addRoot'] = true;
$navInfo['currentPage'] = 'http://www.jogging-international.net/courses/calendrier?fs=1&q=&date_begin=&date_end=&country_code=FR';
//$navInfo['skipNextPage'] =	function (str, p1, offset, s) { return 'page-' + (parseInt(p1, 10)+1) + '?'; };					
//$navInfo['regex'] = /page-(\d+)\?/;
$navInfo['degraded'] = 0; // compteur de degrade
$navInfo['timeinterval'] = 2000; // inteval avant dappeler une page suivante


/* Recupere les infos sur la page qui liste les liens vers les détails (notamment l'url) */
let frameCourses = {
	"root": {
		_s: "article",
		_d: [{
			"name": ".date-result + a @ title",
			"date": ".date-result",
			"url": ".date-result + a @ href"
		}]
	}
};

/* Recupere les info sur la page de détail */
let frameCourse = {
	"root": {
		"_s": "section article",
		"_d": [{
			"title": "h1",
			"date": "[itemprop=articleBody] ul li || : (.*)",
			"region": "[itemprop=articleBody] ul + ul li || : (.*)",
			"commune": "[itemprop=articleBody] ul + ul li + li || : (.*) | before(()",
			"codepostal": "[itemprop=articleBody] ul + ul li + li || : (.*) ", // | nb
			"depart": "[itemprop=articleBody] ul + ul li + li + li || : (.*)",
			"contact": "h2:contains('Contact') + div li || : (.*)",
			"mail": "h2:contains('Contact') + div li + li || : (.*)",
			"phone": "h2:contains('Contact') + div li + li + li || : (.*)",
			"url_club": ".bt-jog @ href",
			"epreuves": {
			"_s": ".jog-data-tab tr",
			"_d": [{"name": "span || - (.*)",
					"distance": "span || ([\\d,\\.]+)",
					"type": "th < html | after(span>)",
					"heuredepart": "li || : (.*)",
					"prix": "li + li || : (.*)",
					"prixsurplace": "li + li + li || : (.*)",
					"description" : "li + li + li + li || : (.*)"
					}]
			},
		}]
	}
};

/* Recupere l'url vers la page suivante */
let frameNextPageUrl = {
	"next": ".prev-next a[rel=next] @ href"
};


console.log($navInfo);

// start with openning the start page
parser_page($navInfo);
//$navInfo['currentPage'] = 'http://www.jogging-international.net/courses/7223-teteghem-cross';
//parser_article($navInfo, function(){});

/*
- Get liste articles de l'URL $current_url using $path_liste_articles
	-- for each PARSE_DETAIL()
- Recherche URL using $path_URL_next_page --> $next_page
	-- appel fonction PARSER_PAGE ($next_page, $path_URL_next_page)
*/
function parser_page(navInfo){
	
	let options = {
	  url: navInfo['currentPage'],
	  headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
	  }
	};
	
	request(options, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
		console.log('[DEBUG] Open root URL: ' + navInfo['currentPage']);
		// la page repond, on peut remettre le compteur de degrade a 0 
		navInfo['degraded'] = 0;
		  
		// parsing the html page with cheerio
		let $ = cheerio.load(html);
		jsonframe($);
		
		let articles = $('body').scrape(frameCourses);
		let nextPage = $('body').scrape(frameNextPageUrl);
		//console.log(articles);
		//console.log(nextPage.next);
		
		let index = 0;
		let timeToFinish = 0 ;

		articles['root'].forEach(function(detail) {
			if(typeof detail.url != 'undefined'){
				timeToFinish++;
			
				let navInfoArticle = copyArray(navInfo);
				
				if(navInfo['addRoot']){
					detail.url = navInfo['rootPage'] + detail.url;
				}
				
				let timeinterval = navInfo['timeinterval'];
				navInfoArticle['currentPage'] = detail.url;
				setTimeout(function(){parser_article(navInfoArticle, function(){timeToFinish--;})}, timeinterval*index);
			}
			index++;
		});

		if(typeof nextPage.next != 'undefined'){
			
			if(navInfo['addRoot']){
				nextPage.next = navInfo['rootPage'] + nextPage.next;
			}
			
			let navInfoNextPage = copyArray(navInfo);
			navInfoNextPage['currentPage'] = nextPage.next;
			
			waitFor(function() {
				// Check in the page if a specific element is now visible
				//console.log('timeToFinish: ' + timeToFinish);
				return timeToFinish == 0;
			}, function() {
			   console.log('[DEBUG] Go to the next page: ' + nextPage.next);
			   parser_page(navInfoNextPage);
			});
		}

	  }else{
		console.log("[ERROR]: Failed to load page " + error + " Statut Code:" + response.statusCode);
		if(navInfo['degraded'] < 10 ){
			// skip the failed page and go to the next
			navInfo['currentPage'] = navInfo['currentPage'].replace(navInfo['regex'], navInfo['skipNextPage']);
			navInfo['degraded']++,
			console.log("[DEBUG]: Go to the next page in degraded mode " + navInfo['currentPage']);
			parser_page(navInfo);
		} else {
			console.log("[ERROR]: Degraded ("+ navInfo['degraded'] +") Statut Code:" + response.statusCode);
		}
	  }
	});
}

function parser_article(navInfo, callback){
	
	let options = {
	  url: navInfo['currentPage'],
	  headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
	  }
	};
	
	request(options, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			console.log('[DEBUG] Open article URL: ' + navInfo['currentPage']);
			let $ = cheerio.load(html);
			// initializes the jsonframe-cheerio plugin
			jsonframe($);
			
			let course =  $('body').scrape(frameCourse);
			course.root[0].urlid = options.url;
			//console.log(course.root);
			
			// BEGIN DB stuff
			MongoClient.connect("mongodb://localhost/todorace", function(error, db) {
				if (error) return funcCallback(error);
				
				var query = { urlid: options.url };
				  db.collection("course").find(query).toArray(function(err, result) {
					if (err) throw err;
					//console.log(result); 
					if(result.length == 0){
						db.collection("course").insert(course.root[0], null, function (error, results) {
						if (error) throw error;

						console.log("Le document a bien été inséré"); 
						db.close();	

						});
					}else{
						console.log("Document deja en base"); 
						db.close();
					}
				  });
				
			});
			// END DB stuff
			
			callback();
		}
	});
}

function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 300000, //< Default Max Timout is 5 min
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
				// If not time-out yet and condition not yet fulfilled
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
			} else {
				if(!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 500); //< repeat check every 250ms
};

function copyArray(mArr){
	var $newArr = [];
	
	Object.keys(mArr).forEach(function(key,index) {
		$newArr[key] = mArr[key];
	});

	return $newArr;
}