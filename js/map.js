(function() {
    // Whole-script strict mode syntax
    'use strict';
    var map,
        largeInfowindow,
        defaultIcon,
        highlightedIcon;


    // Map Initialization
    function initMap() {
        var styles = [{
            'featureType': 'landscape.man_made',
            'elementType': 'geometry',
            'stylers': [{
                'color': '#fdf9eb'
            }]
        }, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry',
            'stylers': [{
                'color': '#def2d5'
            }]
        }, {
            'featureType': 'landscape.natural.terrain',
            'elementType': 'geometry',
            'stylers': [{
                'color': '#def2d5',
                'visibility': 'off'
            }]
        }, {
            'featureType': 'poi',
            'elementType': 'labels',
            'stylers': [{
                'visibility': 'off'
            }]
        }, {
            'featureType': 'poi.business',
            'elementType': 'all',
            'stylers': [{
                'visibility': 'off'
            }]
        }, {
            'featureType': 'poi.medical',
            'elementType': 'geometry',
            'stylers': [{
                'color': '#fbd3da'
            }]
        }, {
            'featureType': 'poi.park',
            'elementType': 'geometry',
            'stylers': [{
                'color': '#def2d5'
            }]
        }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{
                'visibility': 'off'
            }]
        }, {
            'featureType': 'road',
            'elementType': 'labels',
            'stylers': [{
                'visibility': 'on'
            }]
        }, {
            'featureType': 'road',
            'elementType': 'labels.icon',
            'stylers': [{
                'visibility': 'on'
            }]
        }, {
            'featureType': 'road.highway',
            'elementType': 'geometry.fill',
            'stylers': [{
                'color': '#ffe15f'
            }]
        }, {
            'featureType': 'road.highway',
            'elementType': 'geometry.stroke',
            'stylers': [{
                'color': '#efd151'
            }]
        }, {
            'featureType': 'road.arterial',
            'elementType': 'geometry.fill',
            'stylers': [{
                'color': '#ffffff'
            }]
        }, {
            'featureType': 'road.local',
            'elementType': 'geometry.fill',
            'stylers': [{
                'color': 'black'
            }]
        }, {
            'featureType': 'transit.station.airport',
            'elementType': 'geometry.fill',
            'stylers': [{
                'color': '#cfb2db'
            }]
        }, {
            'featureType': 'water',
            'elementType': 'geometry',
            'stylers': [{
                'color': '#b1dafa'
            }]
        }];
        var styledMap = new google.maps.StyledMapType(styles, { name: 'Styled Map' });
        var center = model.position.center;

        map = new google.maps.Map($('#map')[0], {
            center: center,
            maxZoom: 15,
            minZoom: 9,
            mapTypeControl: false,
            styles: styles
        });

        map.mapTypes.set('map_style', styledMap);

        largeInfowindow = new google.maps.InfoWindow();

        defaultIcon = makeMarkerIcon(true);
        highlightedIcon = makeMarkerIcon(false);

        var googleMap = {
            createMarker: createMarker,
            displayInfobox: displayInfobox,
            switchIcon: switchIcon,
            displayMarkers: displayMarkers,
            closeInfoWindow: closeInfoWindow,
            centerMap: centerMap
        };

        getCurrentCenter(center, function(result, status) {
            if (status === 'OK') googleMap.currentCenter = result;
            else googleMap.currentCenter = { center: center, inRatio: true, name: model.position.name };
            window.googleMap = googleMap;
        });
    }

    // Creates map's markers
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

    // Creates marker's pin
    function makeMarkerIcon(isDefault) {
        var pinURL = 'https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=star|f381a7|FFFFFF';
        if (!isDefault) pinURL = 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.4|0|f381a7|14|_|%E2%80%A2';
        var markerImage = new google.maps.MarkerImage(
            pinURL,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    // Add events to a marker
    function addMarkerEvents(marker) {
        marker.addListener('click', function() {
            view.showInList(marker.placeID);
        });
        marker.addListener('mouseover', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        marker.addListener('mouseout', function() {
            largeInfowindow.close();
        });
    }

    // Customizes the info wondow according to the marker's data
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div class="flex-container"><img class="info__image" src="images/smily-cupcake35.png" alt=""><h5 class="info__title">' + marker.title + '</h5></div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        } else infowindow.open(map, marker);
    }

    // Closes the info wondow
    function closeInfoWindow() {
        largeInfowindow.close();
    }

    // Displays the info wondow
    function displayInfobox(marker) {
        populateInfoWindow(marker, largeInfowindow);
        map.panTo(marker.getPosition());
    }

    // Switches the marker's icon
    function switchIcon(marker, isDefault) {
        marker.setVisible(false);
        if (isDefault) marker.setIcon(defaultIcon);
        else marker.setIcon(highlightedIcon);
    }

    // Centers map
    function centerMap(center) {
        map.setCenter(center ? center : map.center);
        map.setZoom(10);
    }

    // Displays markers to be shown on the map
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

    }

    // Retrieves the string name of the user's current location
    // Source: https://gist.github.com/AmirHossein/92a0597b5f723b19c648
    function getLocationFormattedString(point, callback) {
        var geocoder = new google.maps.Geocoder();
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

                    callback(city + ', ' + state + ', ' + country, 'OK');
                }
            } else {
                callback(undefined, status);
            }
        });

    }

    // Retrieves  the position of the user's current location
    function getCurrentCenter(modelCenter, callback) {
        var currentPosition = null;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude, //25.7617,
                    lng: position.coords.longitude //-80.1918
                };

                currentPosition = {
                    center: pos,
                    inRatio: true
                };

                var newCenter = new google.maps.LatLng(pos.lat, pos.lng);
                var previousCenter = new google.maps.LatLng(modelCenter.lat, modelCenter.lng);
                var distance = google.maps.geometry.spherical.computeDistanceBetween(previousCenter, newCenter);

                if (distance > 14700) {
                    currentPosition.inRatio = false;
                }

                getLocationFormattedString(pos, function(result, status) {
                    currentPosition.name = result;
                    if (currentPosition.name.indexOf('United States') < 0) currentPosition.inRatio = true;
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
