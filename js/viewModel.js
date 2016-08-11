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

    self.initPlaces = function() {
        var bounds = new google.maps.LatLngBounds();
        initialPlaces.forEach(
            function(place) {
                var marker = createMarker(place);
                self.places.push(marker);
                bounds.extend(marker.position);
            }
        );
        self.places.sort(function (l, r) { return l.title > r.title ? 1 : -1 });
        map.fitBounds(bounds);
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
        closeInfoWindow();
        var filter = self.searchString().toLowerCase();
        if (!filter) {
            self.showAllPlaces();
            return self.places();
        } else {
            var places = [];
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
            return places;
        }
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
