var AppViewModel = function() {
  // Define self as AppViewModel
  var self = this;

  self.places = ko.observableArray('');

  // Tell the status of the menu
  // Start with menu closed
  self.isMenuVisible = ko.observable(false);
  self.menuIcon = ko.observable('>');

  // Toggle isMenuVisible value and button icon
  // when menu button is clicked
  self.toggleMenu = function() {
    self.isMenuVisible(!self.isMenuVisible());
    if (self.isMenuVisible()) {
      self.menuIcon('<');
    } else {
      self.menuIcon('>');
    }
  };

  // Bind input search value
  self.searchInput = ko.observable("");

  // Bind click value
  self.placeClick = function() {
    var selectedPlace = this;
    allMarkers.forEach(function(marker) {
      if (marker.title === selectedPlace.name) {
        animateMarker(marker);
        openInfowindow(marker);
        self.toggleMenu();
      }
    });
  };

  // When search input or category selector changes,
  // filter the array of places
  var filterPlaces = ko.computed(function() {
    // Filter places' array if condition is true
    var filter = ko.utils.arrayFilter(places, function(place) {
      // Compare everything in lower case
      var normalizeInput = place.name.toLowerCase().indexOf(self.searchInput().toLowerCase());
      return normalizeInput >= 0;
    });
    // When the places are filtered, clear old markers
    // and show new ones
    if (map) {
      clearMarkers();
      filter.forEach(function(place) {
        addMarker(place);
      }, self); 
    }

    self.places(filter);
  });

  self.places(places);
};

ko.applyBindings(new AppViewModel());
