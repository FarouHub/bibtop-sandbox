let url = 'http://www.jogging-international.net/courses/calendrier/page-3?fs=1&q=&date_begin=&date_end=&country_code=FR';

function goNextPage(str, p1, offset, s) {
	console.log("str: " +str+ ", p1: "+p1+", offset: "+offset+", s:" + s);
	console.log(parseInt(p1, 10)+1);
	return 'page-' + (parseInt(p1, 10)+1) + '?';
}
			
let test = /page-(\d+)\?/;

console.log(url.replace(test, goNextPage));