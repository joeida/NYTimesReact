var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
// And we bring in our Note and Article models
var Article = require('../models/Article.js');
// Notice: Our scraping tools are prepared, too
var axios = require('axios');
var request = require('request');
var cheerio = require('cheerio');

// Routes
// ======

// Simple index route
router.get('/', function(req, res) {
  res.sendFile('./public/index.html');
});

router.get('/articles/:query/:startYear/:endYear', function(req, res) {
	var nytAPI = "f40707d94c2d4113b1ddd72a702be080";
	var queryURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + nytAPI + "&q=" + req.params.query + "&begin_date=" + req.params.startYear + "0101&end_date=" + req.params.endYear + "1231";
	return axios.get(queryURL)
		.then(function(response) {
			res.json(response.data.response.docs);
		})
});

router.get('/api/saved', function(req, res){
	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		}
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

router.post('/api/delete', function(req, res) {
	var objKeyList = Object.keys(req.body);
	var objKey = JSON.parse(objKeyList[0]);
	var url = objKey.url;
    Article.find({url: url}).remove().exec();
	res.json(objKey);
});

// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/api/saved', function(req, res){
	// create a new note and pass the req.body to the entry.
	var objKeyList = Object.keys(req.body);
	var objKey = JSON.parse(objKeyList[0]);
	var newArticle = new Article(objKey);

	// and save the new note the db
	newArticle.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		}
		// otherwise
		else {
			res.json(objKey);
		}
	});
});

module.exports = router;
