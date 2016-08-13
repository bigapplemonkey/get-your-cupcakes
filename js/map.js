// Whole-script strict mode syntax
"use strict";

(function() {
    var map,
        largeInfowindow,
        defaultIcon, highlightedIcon;

    function initMap() {
        var styles = [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#7562ab" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": "17" }, { "saturation": "-48" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#4c3775" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#513b90" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#211b34" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f252e" }, { "lightness": 17 }] }];
        var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });
        map = new google.maps.Map($('#map')[0], {
            center: { lat: 40.7413549, lng: -73.9980244 },
            maxZoom: 15,
            // mapTypeControl: false
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'map_style']
            }
        });
        map.mapTypes.set('map_style', styledMap);

        largeInfowindow = new google.maps.InfoWindow();

        defaultIcon = makeMarkerIcon('0091ff');
        highlightedIcon = makeMarkerIcon('FFFF24');

        window.createMarker = createMarker;
        window.closeInfoWindow = closeInfoWindow;
        window.displayInfobox = displayInfobox;
        window.map = map;
    }

    function pinPoster(locations) {
        var service = new google.maps.places.PlacesService(map);

        var len = locations.length;
        for (var place = 0; place < len; place++) {

            var request = {
                query: locations[place]
            };

            service.textSearch(request, callback);
        }
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            testing.push({
                name: results[0].name,
                photos: results[0].photos[0].getUrl({ 'maxWidth': 360, 'maxHeight': 270 }),
                address: results[0].formatted_address,
                priceLevel: results[0].price_level,
                point: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
            });
            var request = {
                placeId: results[0].place_id
            };

            var service = new google.maps.places.PlacesService(map);
            service.getDetails(request, callback2);

        } else {
            console.log("Error!");
        }
    }

    function callback2(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) console.log(results);
        else console.log("Error!");
    }

    function createMarker(place, isNearByPlace) {
        var markerConfig = {
            map: map,
            position: place.point,
            title: place.name,
            animation: google.maps.Animation.DROP,
            photo: place.photo ? place.photo : null,
            address: place.address,
            priceLevel: place.priceLevel ? place.priceLevel : null,
            website: place.website,
            categories: place.categories ? place.categories : null
        };
        if (isNearByPlace) markerConfig.icon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var marker = new google.maps.Marker(markerConfig);
        addMarkerEvents(marker);
        return marker;
    }

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        } else infowindow.open(map, marker);
    }

    function closeInfoWindow() {
        largeInfowindow.close();
    }

    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    function addMarkerEvents(marker) {
        // marker.addListener('click', function() {
        //     populateInfoWindow(this, largeInfowindow);
        // });
        marker.addListener('mouseover', function() {
            // this.setIcon(highlightedIcon);
            populateInfoWindow(this, largeInfowindow);
        });
        marker.addListener('mouseout', function() {
            // this.setIcon(defaultIcon);
            largeInfowindow.close();
        });
    }

    function displayInfobox(marker) {
        populateInfoWindow(marker, largeInfowindow);
        map.panTo(marker.getPosition()); // setCenter takes a LatLng object
    }

    window.initMap = initMap;

})();
