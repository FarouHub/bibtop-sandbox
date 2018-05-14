var natural = require('natural');
var classifier = new natural.BayesClassifier();

classifier.addDocument(['qte', 'quantite', 'qty'], 'quantity');
classifier.addDocument(['ref', 'réf', 'réference', 'reference'], 'code');
classifier.addDocument(['desc', 'description', 'libelle', 'libellé'], 'description');

classifier.train(); 
//console.log(classifier.classify('lib'));

console.log(natural.LevenshteinDistance('reference', 'ref', {search: true}));




