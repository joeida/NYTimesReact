// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');

// Helper Functions (in this case the only one is runQuery)
var helpers = {

	// This function serves our purpose of running the query to nyt.
	runQuery: function(query, startYear, endYear){
		return axios.get('/articles/' + query + '/' + startYear + '/' + endYear)
			.then(function(response){
				// console.log("Returned Response: " + response.data[0].web_url);
				return response.data;
		})
	},

	// This function hits our own server to retrieve the record of query results
	getHistory: function(){
		return axios.get('/api')
			.then(function(response){
				console.log(response);
				return response;
			});
	},

	// This function posts new searches to our database.
	postHistory: function(location){
		return axios.post('/api', {location: location})
			.then(function(results){
				console.log("Posted to MongoDB");
				return(results);
			})
	}

}


// We export the helpers function
module.exports = helpers;