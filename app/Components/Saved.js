// Include React
var React = require('react');

// This is the history component. It will be used to show a log of  recent searches.
var Saved = React.createClass({
	removeArticle: function(event){
		// this.props.addArticle('title', 'url', 'date');
		var title = event.target.getAttribute('data-title');
		var url = event.target.getAttribute('data-url');
		var date = event.target.getAttribute('data-date');
		this.props.removeArticle(title, url, date);
	},
	// Here we render the function
	render: function(){
		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title text-center">Saved Articles</h3>
				</div>
				<div className="panel-body text-center" style={{'height': '200px', 'overflow': 'scroll'}}>
					<div className="col-md-12">
						<div className="col-md-11">
							<p>{'title: ' + this.props.addObj.title}</p>
							<p>{'url: ' + this.props.addObj.url}</p>
							<p>{'date: ' + this.props.addObj.date}</p>
							<br/>
						</div>
						<div className="col-md-1">
							<button type="button" className="btn btn-primary" data-title={this.props.addObj.title} data-url={this.props.addObj.url} data-date={this.props.addObj.date} onClick={this.removeArticle}>
								Remove
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});



// Export the component back for use in other files
module.exports = Saved;
