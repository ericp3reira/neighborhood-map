var map, infowindow;
var allMarkers = [];

// Initiates the map with the desired options
var initMap = function() {
  map = new google.maps.Map(document.getElementById('main-map'), {
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    zoomControl: true,
    zoom: 14,
    center: {lat: -27.593965848993328, lng: -48.5513180662964}
  });
  
  // Put markers on every place
  places.forEach(function(place) {
    var marker = new google.maps.Marker({
      position: place.latlng,
      map: map,
      title: place.name
    });
  
    marker.addListener('click', function() {
      openInfowindow(this);
      animateMarker(this);
    });
    
    AppViewModel.markers.push(marker);
    allMarkers.push(marker);
  });

  infowindow = new google.maps.InfoWindow();
};

// Animates marker (isolated from ViewModel)
var animateMarker = function(marker) {
  marker.setAnimation(google.maps.Animation.DROP);
};

// Show marker
var showMarker = function(marker) {
  marker.setVisible(true);
}

// Clear all markers
var clearMarkers = function() {
  allMarkers.forEach(function(marker) {
    marker.setVisible(false);
  });
};

// Open an infowindow on desired marker
var openInfowindow = function(marker) {
  var request = new XMLHttpRequest();
  var content = "";

  // Send a request to Foursquare API
  request.open('GET', 'https://api.foursquare.com/v2/tips/search?ll=' + marker.position.lat() + ',' + marker.position.lng() + '&client_id=4RHDRLA02U4BFB5IDXBYXE1MDL11HDSNFMM2S0QZARVC2CIS&client_secret=U1B3LJW1K5W5UBSVLQYIXF0CTSKYOMCQXEZRYIK3LEGQY0V2&v=20170909', true);
  
  request.onload = function() {
    // If request is successful, show tips with
    // more likes in infowindow content
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;
      var parseResp = JSON.parse(resp);
      var tips = parseResp.response.tips;
      tips.sort(function(b, a) {
        return a.agreeCount - b.agreeCount;
      });     
      content = '<div class="infowindow-content">'+
      '<h2 class="infowindow-title">' + marker.title + '</h2>'+
      '<div class="infowindow-body">'+
      '<p><em>Foursquare tips:</em></p>'+
      '<p>"' + tips[0].text + '"</p>'+
      '<p>"' + tips[1].text + '"</p>'+
      '<p>"' + tips[2].text + '"</p>'+
      '</div>'+
      '</div>';
    } else {
      content = '<div class="infowindow-content">'+
      '<h2 class="infowindow-title">' + marker.title + '</h2>'+
      '<div class="infowindow-body">'+
      '<p>We could not load the tips...</p>'+
      '<p>Please, try again later.</p>' +
      '</div>'+
      '</div>';
    }
    infowindow.setContent(content);
    infowindow.open(map, marker);
  };
  
  // If there's an error of any nature,
  // let user know that tips could not
  // be loaded
  request.onerror = function() {
    content = '<div class="infowindow-content">'+
    '<h2 class="infowindow-title">' + marker.title + '</h2>'+
    '<div class="infowindow-body">'+
    '<p>We could not load the tips...</p>'+
    '<p>Please, try again later.</p>' +
    '</div>'+
    '</div>';
    infowindow.setContent(content);
    infowindow.open(map, marker);
  };
  
  request.send();
};