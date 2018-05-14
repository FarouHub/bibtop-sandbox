var MongoClient = require("mongodb").MongoClient;

/*
MongoClient.connect("mongodb://localhost/todorace", function(error, db) {
	if (error) throw error;
	
	
	
	
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
*/



console.log('distance:' + Distance(50, 5, 49, 5));


function round(number, X) {
	X = (!X ? 3 : X);
	return Math.round(number*Math.pow(10,X))/Math.pow(10,X);
}



/*************************************/
//Conversion des degrés en radian
//Conversion des degrés en radian
function convertRad(input){
	return (Math.PI * input)/180;
}
 
function Distance(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){
     
	R = 6378000 //Rayon de la terre en mètre
 
    lat_a = convertRad(lat_a_degre);
    lon_a = convertRad(lon_a_degre);
    lat_b = convertRad(lat_b_degre);
    lon_b = convertRad(lon_b_degre);
     
    d = R * (Math.acos( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
    return round(d/1000, 2);
}