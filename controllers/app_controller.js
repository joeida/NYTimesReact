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
	console.log(queryURL);
	return axios.get(queryURL)
		.then(function(response) {
			console.log(response.data.response.docs[0]);
			// res.send("Got Response!!!");
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

router.post('/api/saved/delete', function(req, res) {
	var thisId = req.body.thisId;
	var noteId = req.body.noteId;

	Article.update({_id: thisId}, {$pull: {note: noteId}});
    Article.findOne({_id: thisId}, function(err, article) {
		if (err) {
			console.log(err);
		} else {
			var index = article.note.indexOf(noteId);
			article.note.splice(index, 1);
			article.save();
		}
	});
	Note.remove({_id: noteId}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Successful Remove!");
		}
	});
	res.send(req.body);
});

// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/api/saved/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		}
		// otherwise
		else {
			// using the Article id passed in the id parameter of our url,
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {$push: {'note': doc._id}})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});
// // grab an article by it's ObjectId
// router.get('/articles/:id', function(req, res){
// 	// using the id passed in the id parameter,
// 	// prepare a query that finds the matching one in our db...
// 	Article.findOne({'_id': req.params.id})
// 	// and populate all of the notes associated with it.
// 	.populate('note')
// 	// now, execute our query
// 	.exec(function(err, doc){
// 		// log any errors
// 		if (err){
// 			console.log(err);
// 		}
// 		// otherwise, send the doc to the browser as a json object
// 		else {
// 			res.json(doc);
// 		}
// 	});
// });
//
// // A GET request to scrape the echojs website.
// router.get('/scrape', function(req, res) {
// 	// first, we grab the body of the html with request
//   request('http://www.echojs.com/', function(error, response, html) {
//   	// then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(html);
//     // now, we grab every h2 within an article tag, and do the following:
//     $('article h2').each(function(i, element) {
//
//     		// save an empty result object
// 				var result = {};
//
// 				// add the text and href of every link,
// 				// and save them as properties of the result obj
// 				result.title = $(this).children('a').text();
// 				result.link = $(this).children('a').attr('href');
//
// 				// using our Article model, create a new entry.
// 				// Notice the (result):
// 				// This effectively passes the result object to the entry (and the title and link)
// 				var entry = new Article (result);
//
// 				// now, save that entry to the db
// 				entry.save(function(err, doc) {
// 					// log any errors
// 				  if (err) {
// 				    console.log(err);
// 				  }
// 				  // or log the doc
// 				  else {
// 				    console.log(doc);
// 				  }
// 				});
//
//
//     });
//   });
//   // tell the browser that we finished scraping the text.
//   res.send("Scrape Complete");
// });
//
//
// });

// this will get the articles we scraped from the mongoDB

module.exports = router;
