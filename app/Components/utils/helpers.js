// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');

// Helper Functions (in this case the only one is runQuery)
var helpers = {

	// This function serves our purpose of running the query to nyt.
	runQuery: function(query, startYear, endYear) {
		return axios.get('/articles/' + query + '/' + startYear + '/' + endYear)
			.then(function(response){
				return response.data;
		})
	},

	// This function hits our own server to retrieve the record of query results
	getHistory: function() {
		return axios.get('/api/saved/')
			.then(function(response){
				return response;
			});
	},

	// This function posts new searches to our database.
	postHistory: function(title, url, date) {
		var config = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } };
		return axios.post('/api/saved/', {title: title, url: url, date: date}, config)
			.then(function(results){
				return(results);
			});
	},

	// This function deletes saved Article posts.
	deleteHistory: function(url) {
		var config = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } };
		return axios.post('/api/delete/', {url: url}, config)
			.then(function(results){
				return(results);
			});

	}

}


// We export the helpers function
module.exports = helpers;
