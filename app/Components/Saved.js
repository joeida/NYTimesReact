// Include React
var React = require('react');

// This is the history component. It will be used to show a log of  recent searches.
var Saved = React.createClass({
	handleRemove: function(event){
		console.log("REMOVE CLICKED");
		var url = event.target.getAttribute('data-url');
		console.log(url);
		this.props.removeArticle(url);
	},
	// Here we render the function
	render: function(){
		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title text-center">Saved Articles</h3>
				</div>
				<div className="panel-body text-center" style={{'height': '200px', 'overflow': 'scroll'}}>
					{/* Here we use a map function to loop through an array in JSX*/}
					{this.props.history.map(function(results, i)
						{
							return(
								<div className="col-md-12" key={i}>
									<div className="col-md-11">
										<p>{'title: ' + results.title}</p>
										<p>{'url: ' + results.url}</p>
										<p>{'date: ' + results.date}</p>
										<br/>
									</div>
									<div className="col-md-1">
										<button type="button" className="btn btn-primary" data-url={results.url} onClick={this.handleRemove}>
											Delete
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
module.exports = Saved;
