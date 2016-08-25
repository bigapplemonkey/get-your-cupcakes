var ViewModel = function() {
    var self = this;

    /* Methods */
    self.initPlaces = function() {
        model.initialPlaces.forEach(
            function(place) {
                self.initMarker(place);
            }
        );
    }

    self.getInitialPlacesIDs = function() {
        var placeIDs = [];
        model.initialPlaces.forEach(
            function(place) {
                placeIDs.push(place.placeID);
            });
        return placeIDs;
    };

    self.initMarker = function(place, isNearByPlace) {
        var marker = createMarker(place, isNearByPlace);
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

        self.retrieveDetails(marker);

        if (isNearByPlace) self.nearList.push(marker);
        else self.favoriteList.push(marker);
    };

    self.retrieveDetails = function(place) {
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
            place.rating = result.response.venue.rating;
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
                place.review = place.comments[0].length < 65 ? place.comments[0] : (place.comments[0].substring(0, 60) + '..."');
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
            if (result.response.venue.photos) {
                result.response.venue.photos.groups[0].items.forEach(
                    function(photo) {
                        place.photos.push(photo.prefix + '500x500' + photo.suffix);
                    }
                );
            }
            self.initializedMarkerCount++;
            if (self.placeCount && self.placeCount === self.initializedMarkerCount) self.isDataReady(true);
        }).fail(function(err) {
            console.log(err);
        });
    };

    self.sortPlacesBy = function(index) {
        self.sortBy(self.sortOptions[index]);
    };

    // self.showElement = function(elem) {
    //     $(elem).hide().slideDown();
    // };

    // self.hideElement = function(elem) {
    //     $(elem).slideUp(function() { $(elem).remove(); })
    // };

    self.addToFavorites = function(place) {
        self.nearList.remove(place);
        switchIcon(place, true);
        self.favoriteList.push(place);
        self.savePlace(place);
        view.updateFavoriteCounter(place.title);
    };

    self.removeFromFavorites = function(place) {
        self.favoriteList.remove(place);
        switchIcon(place);
        self.nearList.push(place);
        self.removePlace(place.placeID);
        view.updateNearCounter(place.title);
    };

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

    self.removePlace = function(placeID) {
        model.initialPlaces = $.grep(model.initialPlaces, function(place) {
            return place.placeID.localeCompare(placeID) !== 0;
        });
        localStorage.favoritePlaces = JSON.stringify(model);
    };

    self.initViewElements = function(place) {
        view.initCardElems();
        displayInfobox(place);
    };

    /* Static properties */
    self.sortOptions = [{ optionDisplay: 'Name', optionValue: 'title' },
        { optionDisplay: 'Price', optionValue: 'priceLevel' },
        { optionDisplay: 'Likes', optionValue: 'likes' },
        { optionDisplay: 'Rating', optionValue: 'rating' }
    ];
    self.clientID = 'RNGS24CFZIIKKPYYVPWTQSNTGQIBR5D3IV1MULITVHRT1RDE';
    self.clientSecret = 'D0YLUV1MSDS2NYGKCFJ332CFDOIDIYVRO1ERUS4S5UJF1GTJ';
    self.version = '20130815';

    /* Non-observables */
    self.placeCount = 0;
    self.initializedMarkerCount = 0;

    /* Observables */
    self.searchString = ko.observable('');
    self.sortBy = ko.observable(self.sortOptions[0]);
    self.isTab1Selected = ko.observable(true);
    self.isDataReady = ko.observable(false);
    self.favoriteList = ko.observableArray([]);
    self.nearList = ko.observableArray([]);
    self.filteredFavoriteList = ko.observableArray([]);
    self.filteredNearList = ko.observableArray([]);

    /* Computed */
    ko.computed(function() {
        var placeIDs = self.getInitialPlacesIDs();
        var venueURL = 'https://api.foursquare.com/v2/venues/search';
        venueURL += '?' + $.param({
            'client_id': self.clientID,
            'client_secret': self.clientSecret,
            'v': self.version,
            'll': '40.7,-74',
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
                    // console.log(venue);
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
            console.log(err);
        });
    });

    ko.computed(function() {
        // self.isDataReady(false);
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
                    if (!containsString) diffArray.push();
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
        displayMarkers(hideArray, showArray);
        // self.isDataReady(true);
    });
};

//helpers

function sort(array, sortBy) {
    if (array && sortBy) {
        array.sort(function(l, r) {
            return l[sortBy] > r[sortBy] ? 1 : -1
        })
    }
}

function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
        if (window[name]) {
            callback();
        } else {
            window.setTimeout(arguments.callee, interval);
        }
    }, interval);
}

whenAvailable("map", function() {
    var viewModel = new ViewModel();
    window.viewModel = viewModel;
    viewModel.initPlaces();
    view.init();
    ko.applyBindings(viewModel);
});
