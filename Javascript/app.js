/**
 * Created by ZeyuWang on 11/02/2017.
 */
var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -35.282267, lng: 149.128741},
        zoom: 13,
        mapTypeControl: false
    });

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = [
        {title: 'National Museum of Australia', location: {lat: -35.293189, lng: 149.121190}},
        {title: 'National Library of Australia', location: {lat: -35.296547, lng: 149.129837}},
        {title: 'Australian War Memorial', location: {lat: -35.281106, lng: 149.148334}},
        {title: 'Parliament House', location: {lat: -35.307871, lng: 149.124189}},
        {title: 'The Australian National University', location: {lat: -35.277997, lng: 149.118984}},
        {title: 'Telstra Tower', location: {lat: -35.275891, lng: 149.098601}}
    ];

    var largeInfowindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }
    showListings();

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
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
    }
}

//This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
//
// // This function will loop through the listings and hide them all.
// function hideListings() {
//     for (var i = 0; i < markers.length; i++) {
//         markers[i].setMap(null);
//     }
// }