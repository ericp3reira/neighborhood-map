var AppViewModel = {};

var view = AppViewModel;

// Create an observable array of all markers
view.markers = ko.observableArray();
  
// Tell the status of the menu
// Start with menu closed
view.isMenuVisible = ko.observable(false);
view.menuIcon = ko.observable('>');

// Toggle isMenuVisible value and button icon
// when menu button is clicked
view.toggleMenu = function() {
  this.isMenuVisible(!this.isMenuVisible());
  this.menuIcon(this.isMenuVisible() ? '<' : '>');
};

// Bind input search value
view.searchInput = ko.observable("");

// Bind click value
view.placeClick = function() {
  animateMarker(this);
  openInfowindow(this);
  view.toggleMenu();
};

// When search input or category selector changes,
// filter the array of places
view.filterPlaces = ko.computed(function() {
  // Restart the view markers
  view.markers(allMarkers);
  // Filter markers' array if condition is true
  view.markers(ko.utils.arrayFilter(view.markers(), function(marker) {
    // Compare everything in lower case
    var normalizeInput = marker.title.toLowerCase().indexOf(view.searchInput().toLowerCase());
    return normalizeInput >= 0;
  }));
  if (map) {
    clearMarkers();
    view.markers().forEach(function(marker) {
      showMarker(marker);
    }); 
  }
});

ko.applyBindings(AppViewModel);
