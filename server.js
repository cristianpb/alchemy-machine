//set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');
var _ = require('lodash'); // working with arrays, json

// configuration =================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("Please see: http://localhost:8080/");

// Data
var Data = {
	"Ingredients": [
		{"text": "Avocado",     "emoji" : "🥑 ", "selected" :false, "quantity": 3, "image": "https://cdn.authoritynutrition.com/wp-content/uploads/2014/09/avocado-sliced-in-half.jpg"},
		{"text": "Watermellon", "emoji" : "🍉 ", "selected" :false, "quantity": 2, "image": "http://www.pvfarms.com/images/ourproduce_watermelon.png"},
		{"text": "Jalapeno",    "emoji" : "🌶",   "selected" :false, "quantity": 3, "image": "http://images.realfoodtoronto.com/D.cache.large/Jalapeno-Pepper.jpg"},
		{"text": "Pineapple",   "emoji" : "🍍",  "selected" :false, "quantity": 2, "image": "http://www.cuisine-de-bebe.com/wp-content/uploads/lananas.jpg"},
		{"text": "Kiwi",        "emoji" : "🥝 ", "selected" :false, "quantity": 5, "image": "http://media.mercola.com/assets/images/foodfacts/kiwifruit-nutrition-facts.jpg"},
		{"text": "Strawberry",  "emoji" : "🍓 ", "selected" :false, "quantity": 2, "image": "http://maviedemamanlouve.com/wp-content/uploads/2015/10/fraise-1.jpg"},
		{"text": "Lemon",       "emoji" : "🍋 ", "selected" :false, "quantity": 4, "image": "https://realfood.tesco.com/media/images/Lemon-easter-biscuits-hero-1d74c01d-8906-45fe-8135-322f0520c434-0-472x310.jpg"},
		{"text": "Banana",      "emoji" : "🍌",  "selected" :false, "quantity": 2, "image": "http://www.granini.com/data/images/fruit_images/full/banana.png"}
	],
	"Recipes":[
		{"name" : "Power",      "quantity" : 0, "ingredients" : ["Avocado",   "Jalapeno",    "Pineapple"]},
		{"name" : "Invisibility", "quantity" : 0, "ingredients" : ["Pineapple", "Kiwi",        "Lemon"  ]},
		{"name" : "Agility",    "quantity" : 0, "ingredients" : ["Banana",    "Watermellon", "Strawberry"]}
	],
	"Magic" : [{"value": false, "name": "empty"}]};

// api ---------------------------------------------------------------------

// get all info
app.get('/api/donnes', function(req, res) {
	res.json(Data); // return all info in JSON format
});

// create a potion
app.post('/api/donnes/mix', function(req, res) {
	var mix = [];
	var mixposition = [];
	req.body.Magic[0].value = false;
	for(i=0;i<req.body.Ingredients.length;i++) { 
		console.log("Ingredients",req.body['Ingredients'][i]);
		if (req.body['Ingredients'][i]["selected"] && req.body['Ingredients'][i]["quantity"] > 0) {
			mix.push(req.body['Ingredients'][i]["text"]);
			mixposition.push(i);
		}
	}
	console.log("mix",mix,"fin mix");
	for(i=0;i<req.body.Recipes.length;i++) { 
		console.log("Recipes",req.body.Recipes[i]['ingredients'],"finrece");
		if ( _.isEqual(req.body.Recipes[i]["ingredients"].sort(), mix.sort()) ) {
			req.body.Magic[0].value = true;
			req.body.Magic[0].name = req.body.Recipes[i].name;
			req.body.Recipes[i].quantity++;
			console.log("YesMagic",req.body.Magic[0].value);
			//req.body['Ingredients'][i]["quantity"] 
			for(i=0;i<mix.length;i++) { 
				req.body['Ingredients'][mixposition[i]].quantity--;
			}
		}
	}

	console.log("after magic", req.body);
	fs.writeFile('data.json', JSON.stringify(req.body));
	res.json(req.body);
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
