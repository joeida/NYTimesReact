// Include React
var React = require('react');

// This is the history component. It will be used to show a log of  recent searches.
var Saved = React.createClass({

	// Here we render the function
	render: function(){

		return(

			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title text-center">Saved Articles</h3>
				</div>
				<div className="panel-body text-center" style={{'height': '200px', 'overflow': 'scroll'}}>
					<p>{this.props.topic}</p>
					<p>{this.props.startYear}</p>
					<p>{this.props.endYear}</p>
				</div>
			</div>

		)
	}
});



// Export the component back for use in other files
module.exports = Saved;
