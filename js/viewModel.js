var ViewModel = function() {
    var self = this;

    /* Methods */
    self.initPlaces = function() {
        initialPlaces.forEach(
            function(place) {
                self.initMarker(place);
            }
        );
        sort(self.places, 'title');
    }

    self.initMarker = function(place, isNearByPlace) {
        var marker = createMarker(place, isNearByPlace);
        marker.isShown = ko.computed(function() {
            var placeName = place.name;
            var filter = self.searchString().toLowerCase();
            var isFavorite = $.inArray(placeName, self.favoriteLocations()) > -1;
            var complainsWithFilter = filter ? placeName.toLowerCase().indexOf(filter) >= 0 : true
            var inTab1 = self.isTab1Selected();

            if (complainsWithFilter && isFavorite) {
                return inTab1 ? true : false
            } else if (complainsWithFilter && !isFavorite) {
                return inTab1 ? false : true
            }
            return false;
        });
        self.places.push(marker);
    };

    self.showElement = function(elem) {
        $(elem).hide().slideDown()
    };
    self.hideElement = function(elem) {
        $(elem).slideUp(function() { $(elem).remove(); })
    };

    self.testing = function(place) {
        displayInfobox(place);
    };

    // self.testing2 = function(place) {
    //     self.nearPlaces.remove(place);
    //     self.places.push(place);
    // }

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
        return filteredArray;
    });

    ko.computed(function() {
        var url = 'https://api.foursquare.com/v2/venues/search';
        url += '?' + $.param({
            'client_id': 'RNGS24CFZIIKKPYYVPWTQSNTGQIBR5D3IV1MULITVHRT1RDE',
            'client_secret': 'D0YLUV1MSDS2NYGKCFJ332CFDOIDIYVRO1ERUS4S5UJF1GTJ',
            'v': '20130815',
            'll': '40.7,-74',
            'categoryId': '4bf58dd8d48988d1bc941735',
            'limit': 10
        });

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json'
        }).done(function(result) {
            console.log(result.response.venues);
            result.response.venues.forEach(
                function(venue) {
                    self.initMarker({
                        point: { lat: venue.location.lat, lng: venue.location.lng },
                        name: venue.name,
                        address: venue.location.address,
                        website: venue.url,
                        categories: venue.categories
                    }, true);

                }
            );

        }).fail(function(err) {
            console.log(err);
        });
    });

    /* Favorite locations init */
    initialPlaces.forEach(
        function(place) {
            self.favoriteLocations.push(place.name);
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
    ko.applyBindings(viewModel);
    view.init(viewModel);
    // viewModel.filteredPlaces()[0].visible = false;
});
