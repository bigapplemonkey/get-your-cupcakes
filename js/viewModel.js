var ViewModel = function() {
    var self = this;
    this.locations = [];
    initialPlaceQueries.forEach(
        function(place) {
            self.locations.push(place.query);
        }
    );

    self.searchString = ko.observable('');
    self.places = ko.observableArray([]);
    self.sortOptions = [{ optionDisplay: 'Name', optionValue: 'title' }, { optionDisplay: 'Price', optionValue: 'priceLevel' }];
    self.sortedBy = ko.observable(self.sortOptions[0]);
    self.previousSort = 'Name';

    self.initPlaces = function() {
        var bounds = new google.maps.LatLngBounds();
        initialPlaces.forEach(
            function(place) {
                var marker = createMarker(place);
                self.places.push(marker);
                bounds.extend(marker.position);
            }
        );
        sort(self.places, 'title');
        // map.panBy(-250, 0);
    }

    self.showAllPlaces = function() {
        var bounds = new google.maps.LatLngBounds();
        self.places().forEach(
            function(place) {
                place.setVisible(true)
                bounds.extend(place.position);
            }
        );
        map.fitBounds(bounds);
        // map.panBy(expanded ? 400 : -400, 0);
    };

    self.filteredPlaces = ko.computed(function() {

        var sortedBy = self.sortedBy().optionValue;
        var filter = self.searchString().toLowerCase();
        var places = [];

        if (!filter) {
            self.showAllPlaces();
            places = self.places();
        } else {
            var bounds = new google.maps.LatLngBounds();
            self.places().forEach(
                function(place) {
                    if (place.title.toLowerCase().indexOf(filter) >= 0) {
                        places.push(place);
                        place.setVisible(true);
                        bounds.extend(place.position);
                    } else place.setVisible(false);
                }
            );

            if (places.length > 0) {
                map.fitBounds(bounds);
                // map.panBy(expanded ? 400 : -400, 0);
            } else map.setCenter(new google.maps.LatLng(map.center.lat(), map.center.lng()));
        }

        sort(places, sortedBy);
        return places;
    });

    self.nearPlaces = ko.observableArray([]);
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
            // console.log(result.response.venues);
            // self.nearPlaces(result.response.venues);
            var nearPlaces = [];
            var bounds = new google.maps.LatLngBounds();
            // console.log(result.response.venues[0].location.lat);
            result.response.venues.forEach(
                function(venue) {
                    isNaN(venue.location)
                    console.log(isNaN(venue.location.lat))
                    if (!isNaN(venue.location.lat) || !isNaN(venue.location.lng)) {
                        var marker = createMarker({
                            point: { lat: venue.location.lat, lng: venue.location.lng },
                            name: venue.name,
                            address: venue.location.address,
                            website: venue.url
                        });
                        self.nearPlaces.push(marker);
                        bounds.extend(marker.position);
                    }
                }
            );
            map.fitBounds(bounds);

        }).fail(function(err) {
            console.log(err);
        });
        // return nearPlaces;
    });

    self.showElement = function(elem) {
        $(elem).hide().slideDown()
    }
    self.hideElement = function(elem) {
        $(elem).slideUp(function() { $(elem).remove(); })
    }

    self.testing = function(place) {
        displayInfobox(place);
    }
};

//helpers

function sort(observableArray, sortBy) {
    observableArray.sort(function(l, r) {
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
    viewModel.initPlaces();
    ko.applyBindings(viewModel);
});
