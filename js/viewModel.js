var ViewModel = function() {
    var self = this;

    /* Methods */

    // Initializes places
    self.initPlaces = function() {
        model.initialPlaces.forEach(
            function(place) {
                self.initMarker(place);
            }
        );
    }

    // Returnd IDs of places saved in the model
    self.getInitialPlacesIDs = function() {
        var placeIDs = [];
        model.initialPlaces.forEach(
            function(place) {
                placeIDs.push(place.placeID);
            });
        return placeIDs;
    };

    // Initiliazes a marker
    self.initMarker = function(place, isNearByPlace) {
        var marker = googleMap.createMarker(place, isNearByPlace);

        // Extending marker properties
        marker.address = place.address;
        marker.priceLevel = place.priceLevel ? place.priceLevel : null;
        marker.website = place.website;
        marker.categories = place.categories ? place.categories : null;
        marker.placeID = place.placeID;
        marker.photos = [];
        marker.rating = 0;
        marker.likes = 0;
        marker.priceLevel = '';
        marker.comments = [];
        marker.review = '';
        marker.wifi = false;
        marker.outdoorseating = false;
        marker.delivery = false;
        marker.creditcards = false;
        marker.formattedPhone = '';
        marker.phone = '';
        marker.facebook = '';
        marker.twitter = '';

        self.retrieveDetails(marker, function() {
            if (isNearByPlace) {
                if (marker.photos.length > 0 && marker.comments.length > 0) self.nearList.push(marker);
            } else self.favoriteList.push(marker);
        });
    };

    // Retrieves the deatils of a place
    self.retrieveDetails = function(place, callback) {
        var detailsURL = 'https://api.foursquare.com/v2/venues/' + place.placeID;
        detailsURL += '?' + $.param({
            'client_id': self.clientID,
            'client_secret': self.clientSecret,
            'v': self.version
        });

        $.ajax({
            url: detailsURL,
            method: 'GET',
            dataType: 'json'
        }).done(function(result) {
            place.rating = result.response.venue.rating ? result.response.venue.rating : 0;
            place.likes = result.response.venue.likes.count;
            place.formattedPhone = result.response.venue.contact.formattedPhone;
            place.phone = result.response.venue.contact.phone;
            if (result.response.venue.contact.facebook) place.facebook = result.response.venue.contact.facebook;
            if (result.response.venue.contact.twitter) place.twitter = result.response.venue.contact.twitter;
            if (result.response.venue.price) place.priceLevel = result.response.venue.price.message;
            if (result.response.venue.phrases) {
                result.response.venue.phrases.forEach(
                    function(phrase) {
                        place.comments.push('"' + phrase.sample.text + '"');
                    }
                );
                place.review = place.comments[0].length < 70 ? place.comments[0] : (place.comments[0].substring(0, 65) + '..."');
            }
            if (result.response.venue.attributes) {
                result.response.venue.attributes.groups.forEach(
                    function(group) {
                        group.items.forEach(function(item) {
                            var propertyName = item.displayName.replace(/\s+/g, '').replace('-', '').toLowerCase();
                            if (place.hasOwnProperty(propertyName)) {
                                var value = item.displayValue.toLowerCase();
                                if (value.indexOf('yes') >= 0 || value.indexOf('delivery') >= 0) {
                                    place[propertyName] = true;
                                }
                            }
                        });
                    }
                );
            }
            if (result.response.venue.photos.groups.length > 0) {
                result.response.venue.photos.groups[0].items.forEach(
                    function(photo) {
                        place.photos.push(photo.prefix + '500x500' + photo.suffix);
                    }
                );
            }
            self.initializedMarkerCount++;
            if (self.placeCount && self.placeCount === self.initializedMarkerCount) {
                self.isDataReady(true);
                if (!self.errorMessage()) view.removeLoader();
            }
            callback();
        }).fail(function(err) {
            self.errorHandling('We\'re currently experiencing connectivity issues with Foursquare. Please try again later.');
        });
    };

    // Sorts places by attribute
    self.sortPlacesBy = function(index) {
        self.sortBy(self.sortOptions[index]);
    };

    // Adds places to favorite list
    self.addToFavorites = function(place) {
        self.nearList.remove(place);
        googleMap.switchIcon(place, true);
        self.favoriteList.push(place);
        self.savePlace(place);
        view.updateFavoriteCounter(place.title);
    };

    // Removes places from favorite list
    self.removeFromFavorites = function(place) {
        self.favoriteList.remove(place);
        googleMap.switchIcon(place);
        self.nearList.push(place);
        self.removePlace(place.placeID);
        view.updateNearCounter(place.title);
    };

    // Saves a place in the model
    self.savePlace = function(place) {
        var newPlace = {
            placeID: place.placeID,
            address: place.address,
            name: place.title,
            photos: place.photos,
            point: {
                lat: place.getPosition().lat(),
                lng: place.getPosition().lng()
            },
            priceLevel: place.priceLevel ? place.priceLevel : null,
            website: place.website ? place.website : null
        };
        model.initialPlaces.push(newPlace);
        localStorage.favoritePlaces = JSON.stringify(model);
    };

    // Removes a place from the model
    self.removePlace = function(placeID) {
        model.initialPlaces = $.grep(model.initialPlaces, function(place) {
            return place.placeID.localeCompare(placeID) !== 0;
        });
        localStorage.favoritePlaces = JSON.stringify(model);
    };

    // Updates model
    self.saveModel = function() {
        localStorage.favoritePlaces = JSON.stringify(model);
    };


    // Triggers the view to initialize DOM elements that need to be initialized
    self.initViewElements = function(place) {
        view.initCardElems();
        googleMap.displayInfobox(place);
    };

    // Updates map center in the model
    self.updateCenter = function() {
        model.position = {
            center: googleMap.currentCenter.center,
            name: googleMap.currentCenter.name
        }
        model.initialPlaces = [];
        localStorage.favoritePlaces = JSON.stringify(model);
        googleMap.centerMap(googleMap.currentCenter.center);
        self.initApp(self);
    };

    // Keeps the storaged center from the model
    self.keepCenter = function() {
        self.initApp(self);
    };

    // Returns true when no places are found through the search
    self.showNotFound = function() {
        if (self.searchString().length > 0) {
            if (self.isTab1Selected()) {
                return (self.favoriteList().length > 0 && self.filteredFavoriteList().length === 0);
            } else return (self.nearList().length > 0 && self.filteredNearList().length === 0);
        }
        return false;
    };

    // Hnadles AJAX errors
    self.errorHandling = function(message) {
        self.errorMessage(message);
        view.displayError(message);
    };

    /* Static properties */
    self.sortOptions = [{ optionDisplay: 'Name', optionValue: 'title' },
        { optionDisplay: 'Price&nbsp;&nbsp;&uarr;', optionValue: 'priceLevel' },
        { optionDisplay: 'Likes&nbsp;&nbsp;&darr;', optionValue: 'likes' },
        { optionDisplay: 'Rating&nbsp;&nbsp;&darr;', optionValue: 'rating' }
    ];
    self.clientID = 'RNGS24CFZIIKKPYYVPWTQSNTGQIBR5D3IV1MULITVHRT1RDE';
    self.clientSecret = 'D0YLUV1MSDS2NYGKCFJ332CFDOIDIYVRO1ERUS4S5UJF1GTJ';
    self.version = '20130815';

    /* Non-observables */
    self.placeCount = 0;
    self.initializedMarkerCount = 0;

    /* Observables */
    self.errorMessage = ko.observable('');
    self.searchString = ko.observable('');
    self.sortBy = ko.observable(self.sortOptions[0]);
    self.isTab1Selected = ko.observable(true);
    self.isDataReady = ko.observable(false);
    self.favoriteList = ko.observableArray([]);
    self.nearList = ko.observableArray([]);
    self.filteredFavoriteList = ko.observableArray([]);
    self.filteredNearList = ko.observableArray([]);

    /* Computed */
    self.initComputed = function() {
        ko.computed(function() {
            var centerString = model.position.center.lat + ',' + model.position.center.lng;
            var placeIDs = self.getInitialPlacesIDs();
            var venueURL = 'https://api.foursquare.com/v2/venues/search';
            venueURL += '?' + $.param({
                'client_id': self.clientID,
                'client_secret': self.clientSecret,
                'v': self.version,
                'll': centerString,
                'categoryId': '4bf58dd8d48988d1bc941735'
            });

            $.ajax({
                url: venueURL,
                method: 'GET',
                dataType: 'json'
            }).done(function(result) {
                var validVenueCount = 0;
                result.response.venues.forEach(
                    function(venue) {
                        if (!placeIDs.includes(venue.id)) {
                            self.initMarker({
                                placeID: venue.id,
                                point: { lat: venue.location.lat, lng: venue.location.lng },
                                name: venue.name,
                                address: [venue.location.formattedAddress[0], venue.location.formattedAddress[1]],
                                website: venue.url,
                                categories: venue.categories
                            }, true);
                            validVenueCount++;
                        }
                    }
                );

                self.placeCount = model.initialPlaces.length + validVenueCount;

            }).fail(function(err) {
                self.errorHandling('We\'re currently experiencing connectivity issues with Foursquare. Please try again later.');
            });
        });

        ko.computed(function() {
            var searchString = self.searchString().toLowerCase();
            var filteredArray = [];
            var diffArray = [];
            var showArray = [];
            var hideArray = [];

            if (self.isTab1Selected()) {
                if (searchString) {
                    filteredArray = ko.utils.arrayFilter(self.favoriteList(), function(place) {
                        var containsString = place.title.toLowerCase().indexOf(searchString) >= 0;
                        if (!containsString) diffArray.push(place);
                        return containsString;
                    });
                    sort(filteredArray, self.sortBy().optionValue);
                    self.filteredFavoriteList(filteredArray);
                    hideArray = diffArray.concat(self.filteredNearList());
                    showArray = filteredArray;
                } else {
                    sort(self.favoriteList(), self.sortBy().optionValue);
                    self.filteredFavoriteList(self.favoriteList());
                    hideArray = self.filteredNearList();
                    showArray = self.filteredFavoriteList();
                }
            } else {
                if (searchString) {
                    filteredArray = ko.utils.arrayFilter(self.nearList(), function(place) {
                        var containsString = place.title.toLowerCase().indexOf(searchString) >= 0;
                        if (!containsString) diffArray.push(place);
                        return place.title.toLowerCase().indexOf(searchString) >= 0;
                    });
                    sort(filteredArray, self.sortBy().optionValue);
                    self.filteredNearList(filteredArray);
                    hideArray = diffArray.concat(self.filteredFavoriteList());
                    showArray = filteredArray;
                } else {
                    sort(self.nearList(), self.sortBy().optionValue);
                    self.filteredNearList(self.nearList());
                    hideArray = self.filteredFavoriteList();
                    showArray = self.filteredNearList();
                }
            }
            googleMap.displayMarkers(hideArray, showArray);
        });
    };
};

/* Helpers */

// Sorts array based on attribute
function sort(array, sortBy) {
    var trueValue = 1;
    if (['likes', 'rating'].indexOf(sortBy) > -1) trueValue = trueValue * -1;
    if (array && sortBy) {
        array.sort(function(l, r) {
            return l[sortBy] > r[sortBy] ? trueValue : -trueValue
        })
    }
}

// Waits for object to be loaded
// Source: http://stackoverflow.com/questions/8618464/how-to-wait-for-another-js-to-load-to-proceed-operation
function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
        if (window[name] && typeof window[name] !== 'undefined') {
            callback();
        } else {
            window.setTimeout(arguments.callee, interval);
        }
    }, interval);
}


// Initialized the application
function initApp(viewModel) {
    viewModel.initPlaces();
    viewModel.initComputed();
    window.viewModel = viewModel;
    view.init();
}

// Waits for map to be loaded
$.getScript({
        url: 'https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyADPmIYSbEP83lk3eqoZk0YBHdr8mkASHw&v=3&callback=initMap',
        timeout: 5000 //3 second timeout
    })
    .done(function(script, textStatus) {
        console.log(textStatus);
        whenAvailable('googleMap', function() {
            var viewModel = new ViewModel();
            ko.applyBindings(viewModel);
            if (!googleMap.currentCenter.inRatio) {
                view.openModal();
                viewModel.initApp = initApp;
            } else initApp(viewModel);
        });
    })
    .fail(function(jqxhr, settings, exception) {
        view.displayError('We\'re currently experiencing connectivity issues with Google Map. Please try again later.');
    });
