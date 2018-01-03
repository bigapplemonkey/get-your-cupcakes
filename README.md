# Neighborhood Map

This a single page application featuring locations of cupcake shops near you built using a Model-View-ViewModel pattern.

### Getting started

- Download/clone repository.
- In the project directory simply run `npm install` to install task runner's dependencies.
- Run `grunt` or  `grunt -task-` as needed (available tasks: 'cssmin' and 'uglify').
- Run a local server from the project directory (i.e. `python -m SimpleHTTPServer 8000`).
- Navigate to `http://localhost:8000/` or `http://localhost:8000/index.html`.
- Start using the application.

#### Functionality

- Ability to retrieve near-by cupcake shops.
- Ability to add/remove shops from your Favorite list.
- Ability to retrieve details from a shop as contact information, reviews and photos.
- Ability to sort shops.
- Ability to filter list of shops by name.
- Locations are storaged locally.

#### Frameworks/APIs

- JQuery
- Knockout.js
- Materialize
- Google map API
- Foursquere API

#### How to use

- This application has initially been set up to display cupcake shops in the NYC area. If you access from another US location, the application will prompt you to let the system retrieve your current location. If accepted, depending on your location, the application will ask if a customization is desired according to your current location. If accepted, the model in your local storage will be customized to your new location.
- If you want to restore NYC's initial set up just run on you console the command `localStorage.clear()`.
- Start adding the cucpcake shops you like to your Favorite list.

Chek out the site: [Here](https://bigapplemonkey.github.io/get-your-cupcakes/)
