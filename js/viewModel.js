var ViewModel = function() {
    var self = this;

    /* Methods */
    self.initPlaces = function() {
        model.initialPlaces.forEach(
            function(place) {
                self.initMarker(place);
            }
        );
        sort(self.places, 'title');
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
        marker.isShown = ko.computed(function() {
            var placeID = place.placeID;
            var filter = self.searchString().toLowerCase();
            var isFavorite = $.inArray(placeID, self.favoriteLocations()) > -1;
            var complainsWithFilter = filter ? placeName.toLowerCase().indexOf(filter) >= 0 : true
            var inTab1 = self.isTab1Selected();

            if (complainsWithFilter && isFavorite) {
                return inTab1 ? true : false
            } else if (complainsWithFilter && !isFavorite) {
                return inTab1 ? false : true
            }
            return false;
        });
        marker.photo = place.photo ? place.photo : null;
        marker.address = place.address;
        marker.priceLevel = place.priceLevel ? place.priceLevel : null;
        marker.website = place.website;
        marker.categories = place.categories ? place.categories : null;
        marker.placeID = place.placeID;
        self.places.push(marker);
    };

    self.showElement = function(elem) {
        $(elem).hide().slideDown()
    };
    self.hideElement = function(elem) {
        $(elem).slideUp(function() { $(elem).remove(); })
    };

    self.highlight = function(place) {
        displayInfobox(place);
    };

    self.addToFavorites = function(place) {
        self.favoriteLocations.push(place.placeID);
        switchIcon(place, true);
    }

    self.removeFromFavorites = function(place) {
        self.favoriteLocations.remove(place.placeID);
        switchIcon(place);
    }

    /* Static properties */
    self.sortOptions = [{ optionDisplay: 'Name', optionValue: 'title' }, { optionDisplay: 'Price', optionValue: 'priceLevel' }];

    /* Observables */
    self.searchString = ko.observable('');
    self.sortBy = ko.observable(self.sortOptions[0]);
    self.isTab1Selected = ko.observable(true);
    self.favoriteLocations = ko.observableArray([]);
    self.places = ko.observableArray([]);

    /* Computed */
    self.visiblePlaces = ko.computed(function() {
        closeInfoWindow();
        var bounds = new google.maps.LatLngBounds();
        var filteredArray = ko.utils.arrayFilter(self.places(), function(place) {
            var isShown = place.isShown();
            if (isShown) {
                place.setVisible(true);
                bounds.extend(place.position);
            } else place.setVisible(false);
            return isShown === true;
        });
        map.fitBounds(bounds);

        sort(filteredArray, self.sortBy().optionValue);
        if (filteredArray.length < 1) centerMap();
        return filteredArray;
    });

    ko.computed(function() {
        console.log('here!!!!');
        var placeIDs = self.getInitialPlacesIDs();
        var url = 'https://api.foursquare.com/v2/venues/search';
        url += '?' + $.param({
            'client_id': 'RNGS24CFZIIKKPYYVPWTQSNTGQIBR5D3IV1MULITVHRT1RDE',
            'client_secret': 'D0YLUV1MSDS2NYGKCFJ332CFDOIDIYVRO1ERUS4S5UJF1GTJ',
            'v': '20130815',
            'll': '40.7,-74',
            'categoryId': '4bf58dd8d48988d1bc941735'
        });

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json'
        }).done(function(result) {
            result.response.venues.forEach(
                function(venue) {
                    if (!placeIDs.includes(venue.id)) {
                        self.initMarker({
                            placeID: venue.id,
                            point: { lat: venue.location.lat, lng: venue.location.lng },
                            name: venue.name,
                            address: venue.location.address,
                            website: venue.url,
                            categories: venue.categories
                        }, true);
                    }
                }
            );

        }).fail(function(err) {
            console.log(err);
        });
    });

    /* Favorite locations init */
    self.getInitialPlacesIDs().forEach(
        function(place) {
            self.favoriteLocations.push(place);
        }
    );
};

//helpers

function sort(array, sortBy) {
    array.sort(function(l, r) {
        return l[sortBy] > r[sortBy] ? 1 : -1
    })
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
