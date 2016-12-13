const request = require('request');

module.exports = {

    // Get address in form of street, city, and state and return address object to be used in other API methods
    getAddressObj: function(address, city, state) {
        if (address) {
            var addressText = address.replace(/,/g , "");
            var addressList = addressText.split(' ');
        } else {
            var addressList = '';
        }
        if (addressList === '' && city === '' && state === '') {
            return;
        } else {
            var addressObj = {
                addressList: addressList,
                city: city,
                state: state
            };
            return addressObj;
        }
    },

    // Using address and search criteria, use Google Geo API to get Latitude and Longitude of location chosen and return callback with result to get processed
    getGeoObj: function(addressObj, cb) {
        var query = '';
        var queryList = [];
        var addressList = addressObj.addressList;
        var city = addressObj.city;
        var state = addressObj.state;

        if (addressList) {
            var addressQuery = addressList.join('+');
            queryList.push(addressQuery);
        }
        if (city) {
            queryList.push(city);
        }
        if (state) {
            queryList.push(state);
        }
        query = queryList.join(',+');
        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyAyysdormtiR7lDE-jHt3Hvf6YLo2NK4Ds&language=en";
        request(queryURL, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var returned = JSON.parse(body).results[0];
                var lat1 = returned.geometry.location.lat;
                var lng1 = returned.geometry.location.lng;
                // var queryURL1 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat1 + ',' + lng1 + '&key=AIzaSyAyysdormtiR7lDE-jHt3Hvf6YLo2NK4Ds&language=en'
                var queryURL1 = 'http://www.mapquestapi.com/geocoding/v1/reverse?key=7HxdrOxNAGDALo8IA4qt4HOgsprXrW6m&location=' + lat1 + ',' + lng1 + '&includeRoadMetadata=true&includeNearestIntersection=true'
                request(queryURL1, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // console.log(JSON.parse(body));
                        // var returned1 = JSON.parse(body).results[0];
                        var returned1 = JSON.parse(body).results[0].locations[0];
                        // console.log(returned1);
                        if (returned1.adminArea3) {
                            var address = returned1.street + ', ' + returned1.adminArea5 + ', ' + returned1.adminArea3 + ', ' + returned1.adminArea1;
                        } else {
                            var address = returned1.street + ', ' + returned1.adminArea5 + ', ' + returned1.adminArea1;
                        }
                        var geoObj = {
                            // lat: returned1.geometry.location.lat,
                            // lng: returned1.geometry.location.lng,
                            // address: returned1.formatted_address
                            lat: returned1.latLng.lat,
                            lng: returned1.latLng.lng,
                            address: address
                        };
                        // console.log(geoObj);
                        // console.log(geoObj);
                        cb(geoObj);
                    } else {
                        console.log("Error on getting Reverse GeoCoordinates " + error);
                        return;
                    }
                });
            } else {
                console.log("Error on getting GeoCoordinates " + error);
                return;
            }
        });
    },

    // Get safezone locations list based on current geoCoordinates and a location type specified by function caller and return callback with result to get processed
    getSafezonesList: function(geoObj, cb) {
        var locationTypeList = ['hospital'];
        // var locationTypeList = ['embassy', 'hospital', 'police', 'airport', 'bank', 'fire_station', 'church', 'synagogue'];
        // var locationTypeList = ['embassy', 'hospital', 'police', 'airport', 'bank'];
        var safezonesCounter = 0;
        var safezonesResultList = [];

        var sourceObj = {
            lat: geoObj.lat,
            lng: geoObj.lng,
            address: geoObj.address,
            name: 'Target Location',
            locationType: 'home',
        };
        safezonesResultList.push(sourceObj);

        locationTypeList.forEach(function(locationType) {

            var queryURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + geoObj.lat + ',' + geoObj.lng + '&radius=5000&types=' + locationType + '&key=AIzaSyAyysdormtiR7lDE-jHt3Hvf6YLo2NK4Ds'
            // var queryURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + geoObj.lat + ',' + geoObj.lng + '&radius=5000&types=' + locationType + '&key=AIzaSyCdKTEHizAqhcNWoqo7TjU3WN0E4miTwBc'
            request(queryURL, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var returned = JSON.parse(body).results;
                    returned.forEach(function(child) {
                        var safezonesObj = {
                            lat: child.geometry.location.lat,
                            lng: child.geometry.location.lng,
                            address: child.vicinity,
                            name: child.name,
                            locationType: locationType,
                        }
                        safezonesResultList.push(safezonesObj);
                    });
                } else {
                    console.log("Error on getting safezone Locations " + error);
                    return;
                }
                safezonesCounter++;
                if (safezonesCounter === locationTypeList.length) {
                    cb(safezonesResultList);
                }
            });
        })
    },

    getSafezonesNumber: function(geoObj) {
        return new Promise(function(resolve, reject) {
            var locationTypeList = ['embassy', 'hospital', 'police', 'airport', 'bank', 'fire_station', 'church', 'synagogue'];
            // var locationTypeList = ['embassy', 'hospital', 'police', 'airport', 'bank'];
            var safezonesCounter = 0;
            var safezonesResultList = [];

            var sourceObj = {
                lat: geoObj.lat,
                lng: geoObj.lng,
                address: geoObj.address,
                name: 'Target Location',
                locationType: 'home',
            };
            safezonesResultList.push(sourceObj);

            locationTypeList.forEach(function(locationType) {
                var queryURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + geoObj.lat + ',' + geoObj.lng + '&radius=5000&types=' + locationType + '&key=AIzaSyAyysdormtiR7lDE-jHt3Hvf6YLo2NK4Ds'
                // var queryURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + geoObj.lat + ',' + geoObj.lng + '&radius=5000&types=' + locationType + '&key=AIzaSyCdKTEHizAqhcNWoqo7TjU3WN0E4miTwBc'
                request(queryURL, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var returned = JSON.parse(body).results;
                        returned.forEach(function(child) {
                            var safezonesObj = {
                                lat: child.geometry.location.lat,
                                lng: child.geometry.location.lng,
                                address: child.vicinity,
                                name: child.name,
                                locationType: locationType,
                            }
                            safezonesResultList.push(safezonesObj);
                        });
                    } else {
                        console.log("Error on getting safezone Locations " + error);
                        return;
                    }
                    safezonesCounter++;
                    if (safezonesCounter === locationTypeList.length) {
                        resolve(safezonesResultList);
                    }
                });
            });
        });
    }
}
