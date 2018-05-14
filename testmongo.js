var MongoClient = require("mongodb").MongoClient;

var objNew = {
  "root": [
    {
      "title": "Teteghem Cross",
      "date": "20/11/2017",
      "region": "Hauts-de-France",
      "commune": "Téteghem-Coudekerque-Village",
      "codepostal": "59229",
      "depart": "Rue du Général Lucas (parc du canal des Moëres)",
      "contact": "Athlétisme Teteghem - Philippe Froment",
      "mail": "philippefroment@laposte.net",
      "phone": "06 66 39 91 89",
      "url_club": "http://www.athletisme-teteghem.fr",
      "epreuve": [
        {
          "name": "Teteghem Cross 2017 (2)",
          "distance": "5,350",
          "type": "Cross",
          "heuredepart": "09h45",
          "prix": "1",
          "prixsurplace": "1",
          "description": "Cross avec parcours sur herbe et sentiers en sous-bois (pointes autorisées), obstacles naturels (petites bosses), nombreuses relances : un cross \"à l'ancienne\"."
        },
        {
          "name": "Teteghem Cross 2017 (1)",
          "distance": "3,650",
          "type": "Course f&#xE9;minine / Cross",
          "heuredepart": "nc",
          "prix": "1",
          "prixsurplace": "1"
        }
      ]
    }
  ]
};  



MongoClient.connect("mongodb://localhost/todorace", function(error, db) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données 'todorace'");
	
	
	db.collection("course").insert(objNew, null, function (error, results) {
    if (error) throw error;

    console.log("Le document a bien été inséré");  

	
	});
	db.close();
});