
var request = require('request');


	let options = {
	  url: "http://www.bibtop.co",
	  proxy: 'http://173.234.249.27:3128',
	  headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
	  }
	};
	
	request(options, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			console.log('[DEBUG] Open article URL: ' + options.url);
			console.log(html);
		}else{
			console.log(error);
			console.log(response.statusCode);
		}
	});



