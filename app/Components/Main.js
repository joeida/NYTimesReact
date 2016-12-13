// Include React
var React = require('react');

// Here we include all of the sub-components
var Saved = require('./Saved');
var Search = require('./Search');
var Results = require('./Results');
var Map = require('./Map');
var GoogleApiComponent = require('./GoogleApiComponent');

// Helper Function
var helpers = require('./utils/helpers.js');

// This is the main component.
var Main = React.createClass({

	// Here we set a generic state associated with the number of clicks
	getInitialState: function(){
		return {
			topic: "",
			startYear: "",
			endYear: "", /*Note how we added in this history state variable*/
			address: "",
			lat: "",
			lng: "",
			mresults: [],
			results: [],
			addTitle: "",
			addURL: "",
			addDate: "",
			addObj: {},
			removeURL: "",
			history: []
		}
	},

	// This function allows childrens to update the parent.
	setSearch: function(topic, startYear, endYear){
		this.setState({
			topic: topic,
			startYear: startYear,
			endYear: endYear
		})
	},

	setMap: function(address, lat, lng) {
		this.setState({
			address: address,
			lat: lat,
			lng: lng
		})
	},

	addArticle: function(title, url, date) {
		this.setState({
			addTitle: title,
			addURL: url,
			addDate: date
		})
	},

	removeArticle: function(url) {
		this.setState({
			removeURL: url
		})
	},

	componentDidUpdate: function(prevProps, prevState) {
		if(prevState.address != this.state.address && prevState.lat != this.state.lat && prevState.lng != this.state.lng) {
			console.log(this.state.address, this.state.lat, this.state.lng);
			helpers.getSafezones(this.state.address, this.state.lat, this.state.lng)
				.then(function(data) {
					if (data.data != this.state.mresults) {
						this.setState({
							mresults: data.data
						})
						console.log(this.state.mresults);
					}
					this.refs.child.generateMap();
				}.bind(this))
		}
		if(prevState.topic != this.state.topic) {
			helpers.runQuery(this.state.topic, this.state.startYear, this.state.endYear)
				.then(function(data) {
					if (data != this.state.results) {
						this.setState({
							results: data
						})
					}
				}.bind(this))
		}
		if(prevState.addTitle != this.state.addTitle && prevState.addURL != this.state.addURL && prevState.addDate != this.state.addDate) {
			helpers.postHistory(this.state.addTitle, this.state.addURL, this.state.addDate)
				.then(function(data) {
					this.setState({
						addObj: data.data
					})
				}.bind(this))
				.then(function(data) {
					helpers.getHistory()
						.then(function(response){
							if (response != this.state.history){
								this.setState({
									history: response.data
								})
							}
						}.bind(this))
				}.bind(this))
		}
		if(prevState.removeURL != this.state.removeURL) {
			helpers.deleteHistory(this.state.removeURL)
				.then(function(data) {
					helpers.getHistory()
						.then(function(response){
							if (response != this.state.history){
								this.setState({
									history: response.data
								})
							}
						}.bind(this))
				}.bind(this))
		}
	},
	componentWillMount: function() {
		const script = document.createElement("script");

	    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBafXeEZdeN3wqsxir8ca5e8DhkMwuBmrI&callback=initMap";
	    script.async = true;

	    document.body.appendChild(script);
	},
	componentDidMount: function(){
	// Get the latest history.
	helpers.getHistory()
		.then(function(response){
			if (response != this.state.history){
				this.setState({
					history: response.data
				})
			}
		}.bind(this))
	// const script = document.createElement("script");
	//
    // script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBafXeEZdeN3wqsxir8ca5e8DhkMwuBmrI&callback=initMap";
    // script.async = true;
	//
    // document.body.appendChild(script);
	},

	// Here we render the function
	render: function(){
		return(

			<div className="container">

				<div className="row">

					<div className="jumbotron">
						<h2 className="text-center">New York Times Article Scrubber</h2>
						<p className="text-center"><em>Search for and annotate articles of interest!</em></p>
					</div>

				</div>

				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-10">

						<Search setSearch={this.setSearch} setMap={this.setMap}/>

					</div>
					<div className="col-md-1"></div>
				</div>

				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-10">

						<Map results={this.state.mresults} address={this.state.address} lat={this.state.lat} lng={this.state.lng} ref="child"/>

					</div>
					<div className="col-md-1"></div>
				</div>

				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-10">

						<Results results={this.state.results} addArticle={this.addArticle}/>

					</div>
					<div className="col-md-1"></div>
				</div>

				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-10">

						<Saved history={this.state.history} removeArticle={this.removeArticle}/>

					</div>
					<div className="col-md-1"></div>
				</div>

			</div>
		)
	}
});

// Export the component back for use in other files
module.exports = Main;
