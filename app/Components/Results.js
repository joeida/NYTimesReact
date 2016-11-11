// Include React
var React = require('react');

// This is the results component
var Results = React.createClass({

	// Here we render the function
	render: function(){

		return(

			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title text-center">Results</h3>
				</div>
				<div className="panel-body text-center" style={{'height': '200px', 'overflow': 'scroll'}}>

						<h4>Article Results:</h4>
						{/* Here we use a map function to loop through an array in JSX*/}
						{this.props.results.map(function(results, i)
							{
								return <p key={i}>{results.headline.main} - {results.web_url}</p>
							}
						)}

				</div>
			</div>

		)
	}
});

// Export the component back for use in other files
module.exports = Results;
