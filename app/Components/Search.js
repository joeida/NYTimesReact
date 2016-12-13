// Include React
var React = require('react');

// This is the form component.
var Search = React.createClass({
	// Here we set a generic state associated with the text being searched for
	getInitialState: function(){
		return {
			topic: "",
			startYear: "",
			endYear: "",
			address: "",
			lat: "",
			lng: ""
		}
	},
	// This function will respond to the user input
	handleChange: function(event){
    	// Here we create syntax to capture any change in text to the query terms (pre-search).
    	var newState = {};
    	newState[event.target.id] = event.target.value;
    	this.setState(newState);
	},
	// When a user submits...
	handleClick: function(){
		// Set the parent to have the search term
		this.props.setSearch(this.state.topic, this.state.startYear, this.state.endYear);
		this.refs.topic.value = '';
		this.refs.startYear.value = '';
		this.refs.endYear.value = '';
	},
	handleMap: function() {
		this.props.setMap(this.state.address, this.state.lat, this.state.lng);
	},
	// Here we render the function
	render: function(){

		return(
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title text-center">Search</h3>
				</div>
				<div className="panel-body text-center">

						<form>
							<div className="form-group">
								<h4 className=""><strong>Topic</strong></h4>

								<input type="text" className="form-control text-center" id="topic" onChange= {this.handleChange} ref="topic" required/>
								<br />
								<h4 className=""><strong>Start Year</strong></h4>

								<input type="text" className="form-control text-center" id="startYear" onChange= {this.handleChange} ref="startYear" required/>
								<br />
								<h4 className=""><strong>End Year</strong></h4>

								<input type="text" className="form-control text-center" id="endYear" onChange= {this.handleChange} ref="endYear" required/>
								<br />
								<button type="button" className="btn btn-primary" onClick={this.handleClick}>Search</button>


								<h4 className=""><strong>Address</strong></h4>

								<input type="text" className="form-control text-center" id="address" onChange= {this.handleChange} ref="address" required/>
								<br />
								<h4 className=""><strong>Lat</strong></h4>

								<input type="text" className="form-control text-center" id="lat" onChange= {this.handleChange} ref="lat" required/>
								<br />
								<h4 className=""><strong>Lng</strong></h4>

								<input type="text" className="form-control text-center" id="lng" onChange= {this.handleChange} ref="lng" required/>
								<br />
								<button type="button" className="btn btn-primary" onClick={this.handleMap}>Get Map</button>
							</div>

						</form>
				</div>
			</div>
		)
	}
});

// Export the component back for use in other files
module.exports = Search;
