var records = {
    position: {
        center: { lat: 40.7413549, lng: -73.9980244 },
        name: 'New York, New York, United States'
    },
    initialPlaces: [{
        placeID: '417c4200f964a520cd1d1fe3',
        address: ['184 9th Ave', 'New York, NY 10011'],
        name: 'Billy\'s Bakery',
        point: {
            lat: 40.7453449,
            lng: -74.00193769999998
        },
        website: 'http://www.billysbakerynyc.com/'
    }, {
        placeID: '4cd1d42cde0f6dcb316e7363',
        address: ['112 8th Ave', 'New York, NY 10011'],
        name: 'Empire Cake',
        point: {
            lat: 40.7407544,
            lng: -74.00153920000002
        },
        website: 'http://empirecake.com/'
    }, {
        placeID: '4e28648c2271752a4594123e',
        address: ['228 Bleecker St', 'New York, NY 10014'],
        name: 'Molly\'s Cupcakes',
        point: {
            lat: 40.73011109999999,
            lng: -74.00253839999999
        },
        website: 'http://mollyscupcakes.com/'
    }, {
        placeID: '4a06f82df964a52010731fe3',
        address: ['1652 2nd Ave (btwn E 85th & E 86th St)', 'New York, NY'],
        name: 'Two Little Red Hens',
        point: {
            lat: 40.7776095,
            lng: -73.9520635
        },
        website: 'http://www.twolittleredhens.com/'
    }, {
        placeID: '3fd66200f964a5203be71ee3',
        address: ['401 Bleecker Street', 'New York, NY 10014'],
        name: 'Magnolia Bakery',
        point: {
            lat: 40.7358704,
            lng: -74.00498449999998
        },
        website: 'http://www.magnoliabakery.com/'
    }]
};


(function() {
    if (!localStorage.favoritePlaces) {
        console.log('Adding records...');
        localStorage.favoritePlaces = JSON.stringify(records);
    }
}());

var model = JSON.parse(localStorage.favoritePlaces);
