var records = {
    // initialPlaceQueries: [
    //     { query: 'Billy\'s Bakery 9th Ave New York' },
    //     { query: 'Empire Cake 8th Ave New York' },
    //     { query: 'Magnolia Bakery Bleecker Street New York' },
    //     { query: 'Molly\'s cupcakes  Bleecker Street New York' },
    //     { query: 'Crumbs University Pl New York' }
    // ],
    initialPlaces: [{
        placeID: "417c4200f964a520cd1d1fe3",
        address: "184 9th Ave, New York, NY 10011, United States",
        name: "Billy\'s Bakery",
        // photo: "https://lh4.googleusercontent.com/-_Jzh1pcPmoQ/V6CgnY55KrI/AAAAAAAAAFo/gQFSf9AqQNMgyq45Zug2QknT1slzPXW6QCLIB/w360-h270-k/",
        point: {
            lat: 40.7453449,
            lng: -74.00193769999998
        },
        priceLevel: 1,
        website: "http://www.billysbakerynyc.com/"
    }, {
        placeID: "4cd1d42cde0f6dcb316e7363",
        address: "112 8th Ave, New York, NY 10011, United States",
        name: "Empire Cake",
        // photo: "https://lh5.googleusercontent.com/-Pg7GTW1pjKc/VneX18-6IBI/AAAAAAABJsA/uTF91SbNO8Ew6nQjQFXKckwn9ciBvHWew/w360-h270-k/",
        point: {
            lat: 40.7407544,
            lng: -74.00153920000002
        },
        priceLevel: 2,
        website: "http://empirecake.com/"
    }, {
        placeID: "4e28648c2271752a4594123e",
        address: "228 Bleecker St, New York, NY 10014, United States",
        name: "Molly\'s Cupcakes",
        // photo: "https://lh4.googleusercontent.com/-XpK1ZJCSUj4/UALt7mkhdnI/AAAAAAAAjyw/OhiD5gmujTof_yvCgWECUyaDqezP0l09g/w360-h270-k/",
        point: {
            lat: 40.73011109999999,
            lng: -74.00253839999999
        },
        priceLevel: 1,
        website: "http://mollyscupcakes.com/"
    }, {
        placeID: "4a06f82df964a52010731fe3",
        address: "1652 2nd Ave (btwn E 85th & E 86th St), New York, NY",
        name: "Two Little Red Hens",
        // photo: "https://irs1.4sqi.net/img/general/width960/2983080_WTDbU_CUdtA0Fg96YIZGbdqC6bp_rGYmxwIonInEyKo.jpg",
        point: {
            lat: 40.7776095,
            lng: -73.9520635
        },
        priceLevel: 5,
        website: "http://www.twolittleredhens.com/"
    }, {
        placeID: "3fd66200f964a5203be71ee3",
        address: "401 Bleecker Street, New York, NY 10014, United States",
        name: "Magnolia Bakery",
        // photo: "https://lh5.googleusercontent.com/-rBcjawYhj_g/Vpzq96EjliI/AAAAAAAAVUo/HjMSPpDLkPA68FgeDW94OHWr5nYDbe3OA/w360-h270-k/",
        point: {
            lat: 40.7358704,
            lng: -74.00498449999998
        },
        priceLevel: 1,
        website: "http://www.magnoliabakery.com/"
    }]
};


(function() {
    if (!localStorage.favoritePlaces) {
        console.log('Adding records...');
        localStorage.favoritePlaces = JSON.stringify(records);
    }
}());

var model = JSON.parse(localStorage.favoritePlaces);
