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


    }
    showListings();
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

function MyViewModel() {
    this.query = ko.observable('');
    this.markers = [{
        title: 'National Museum of Australia',
        lat: ' -35.293189',
        lng: '149.121190',
        id: 'list1',
        streetAddress: 'Lawson Cres',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: true,
        mapVisible: true
    },{
        title: 'National Library of Australia',
        lat: ' -35.296547',
        lng: '149.129837',
        id: 'list2',
        streetAddress: 'Parkes Pl W',
        cityAddress: 'Canberra ACT 2600, Australia',
        listVisible: true,
        mapVisible: true
    },{
        title: 'Australian War Memorial',
        lat: ' -35.281106',
        lng: '149.148334',
        id: 'list3',
        streetAddress: 'Treloar Cres',
        cityAddress: 'Campbell ACT 2612, Australia',
        listVisible: true,
        mapVisible: true
    },{
        title: 'Parliament House',
        lat: ' -35.307871',
        lng: '149.124189',
        id: 'list4',
        streetAddress: 'Parliament Dr',
        cityAddress: 'Canberra ACT 2600, Australia',
        listVisible: true,
        mapVisible: true
    },{
        title: 'The Australian National University',
        lat: ' -35.277997',
        lng: '149.118984',
        id: 'list5',
        streetAddress: 'Acton',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: true,
        mapVisible: true
    },{
        title: 'Telstra Tower',
        lat: ' -35.275891',
        lng: '149.098601',
        id: 'list6',
        streetAddress: '100 Black Mountain Dr',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: true,
        mapVisible: true
    }];
}

// viewModel.markers = ko.dependentObservable(function() {
//     var self = this;
//     var search = self.query().toLowerCase();
//     return ko.utils.arrayFilter(markers, function(marker) {
//         if (marker.title.toLowerCase().indexOf(search) >= 0) {
//             marker.mapVisible = true;
//             return marker.listVisible(true);
//         } else {
//             marker.mapVisible = false;
//             setAllMap();
//             return marker.listVisible(false);
//         }
//     });
//
// },viewModel);

ko.applyBindings(new MyViewModel());


