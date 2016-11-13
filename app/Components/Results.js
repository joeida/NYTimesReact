// Include React
var React = require('react');

// This is the results component
var Results = React.createClass({
	handleArticle: function(event){
		// this.props.addArticle('title', 'url', 'date');
		var title = event.target.getAttribute('data-title');
		var url = event.target.getAttribute('data-url');
		var date = event.target.getAttribute('data-date');
		this.props.addArticle(title, url, date);
	},
	//Here we render the function
	render: function(){

		return(

			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title text-center">Results</h3>
				</div>
				<div className="panel-body" style={{'height': '200px', 'overflow': 'scroll'}}>

						{/* Here we use a map function to loop through an array in JSX*/}
						{this.props.results.map(function(results, i)
							{
								return(
									<div className="col-md-12" key={i}>
										<div className="col-md-11">
											<p>{'title: ' + results.headline.main}</p>
											<p>{'url: ' + results.web_url}</p>
											<p>{'date: ' + results.pub_date}</p>
											<br/>
										</div>
										<div className="col-md-1">
											<button type="button" className="btn btn-primary" data-title={results.headline.main} data-url={results.web_url} data-date={results.pub_date} onClick={this.handleArticle}>
												Save
											</button>
										</div>
									</div>
								)
							}.bind(this)
						)};
				</div>
			</div>
		)
	}
});

// Export the component back for use in other files
module.exports = Results;
