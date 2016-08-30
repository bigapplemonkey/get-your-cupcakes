// Whole-script strict mode syntax
"use strict";

// [
//                         [34.0522, -118.2437],
//                         [41.8781, -87.6298],
//                         [25.7617, -80.1918]
//                     ] 14700

(function() {
    var map,
        largeInfowindow,
        defaultIcon, highlightedIcon;

    function initMap() {
        var styles = [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#7562ab" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": "17" }, { "saturation": "-48" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#4c3775" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#513b90" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#211b34" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f252e" }, { "lightness": 17 }] }];
        var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });
        var center = model.position.center;

        map = new google.maps.Map($('#map')[0], {
            center: center,
            maxZoom: 15,
            minZoom: 9,
            mapTypeControl: false
                // mapTypeControlOptions: {
                //     mapTypeIds: ['roadmap', 'map_style']
                // }
        });

        map.mapTypes.set('map_style', styledMap);

        largeInfowindow = new google.maps.InfoWindow();

        defaultIcon = makeMarkerIcon('0091ff');
        highlightedIcon = makeMarkerIcon('FFFF24');

        var infoWindow = new google.maps.InfoWindow({ map: map });

        var googleMap = {
            createMarker: createMarker,
            displayInfobox: displayInfobox,
            switchIcon: switchIcon,
            displayMarkers: displayMarkers,
            closeInfoWindow: closeInfoWindow,
            centerMap: centerMap
        }

        getCurrentCenter(center, function(result, status) {
            googleMap.currentCenter = result;
            window.googleMap = googleMap;
        });
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
            visible: false,
            animation: google.maps.Animation.DROP
        };
        var marker = new google.maps.Marker(markerConfig);

        if (isNearByPlace) marker.setIcon(highlightedIcon);
        else marker.setIcon(defaultIcon);

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
            'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
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
        map.panTo(marker.getPosition());
    }

    function switchIcon(marker, isDefault) {
        marker.setVisible(false);
        if (isDefault) marker.setIcon(defaultIcon);
        else marker.setIcon(highlightedIcon);
    }

    function centerMap(center) {
        map.setCenter(center ? center : map.center)
        map.setZoom(10);
    }

    function displayMarkers(markersToHide, markersToShow) {
        closeInfoWindow();

        markersToHide.forEach(function(marker) {
            marker.setVisible(false);
        });

        if (markersToShow.length > 0) {

            var bounds = new google.maps.LatLngBounds();
            markersToShow.forEach(function(marker) {
                marker.setVisible(true);
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);
        } else centerMap();

    };

    function getLocationFormattedString(point, callback) {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'location': point }, function(results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    var country = null,
                        city = null,
                        state = null;
                    var c, lc, component;
                    for (var r = 0, rl = results.length; r < rl; r += 1) {
                        var result = results[r];

                        if (!city && result.types[0] === 'locality') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];

                                if (component.types[0] === 'locality') {
                                    city = component.long_name;
                                    break;
                                }
                            }
                        } else if (!state && result.types[0] === 'administrative_area_level_1') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];

                                if (component.types[0] === 'administrative_area_level_1' &&
                                    component.types[1] === 'political') {
                                    state = component.long_name;
                                    break;
                                }
                            }
                        } else if (!country && result.types[0] === 'country') {
                            country = result.address_components[0].long_name;
                        }

                        if (city && country) {
                            break;
                        }
                    }

                    callback(city + ", " + state + ", " + country, 'OK');
                }
            } else {
                callback(undefined, status);
            }
        });

    }

    function getCurrentCenter(modelCenter, callback) {
        var currentPosition = null;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: 25.7617, //position.coords.latitude,
                    lng: -80.1918 //position.coords.longitude
                };

                currentPosition = {
                    center: pos,
                    inRatio: true
                }

                var newCenter = new google.maps.LatLng(pos.lat, pos.lng);
                var previousCenter = new google.maps.LatLng(modelCenter.lat, modelCenter.lng);
                var distance = google.maps.geometry.spherical.computeDistanceBetween(previousCenter, newCenter);

                if (distance > 14700) {
                    currentPosition.inRatio = false;
                }

                getLocationFormattedString(pos, function(result, status) {
                    currentPosition.name = result;
                    callback(currentPosition, 'OK');
                });

            }, function() {
                callback(undefined, 'ERROR');
            });
        } else {
            callback(undefined, 'NOT_SUPPORTED');
        }
    }

    window.initMap = initMap;

})();
