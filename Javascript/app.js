/**
 * Created by ZeyuWang on 11/02/2017.
 */
var map;

// Create a new blank array for all the listing markers.
var markers = [];
var content;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -35.282267, lng: 149.128741},
        zoom: 13,
        mapTypeControl: false
    });

    // Responsible: hide List View when width less than 850 and height is less than 595
    if ($(window).width() < 850 || $(window).height() < 595) {
        $("#scroller").hide();
    }

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // Create Information Window
    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < ViewModel.markersSrc.length; i++) {
        // Get the position from the location array.
        // var position = ViewModel.markers[i].location;
        var position = new google.maps.LatLng(ViewModel.markersSrc[i].lat, ViewModel.markersSrc[i].lng);
        var title = ViewModel.markersSrc[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            streetAddress: ViewModel.markersSrc[i].streetAddress,
            cityAddress: ViewModel.markersSrc[i].cityAddress,
            icon: defaultIcon
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        //marker's response when click, mouseover and mouseout
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        //Reset, show and hide button
        $( "#btn-class" ).click(function() {
            map.setZoom(14);
            map.setCenter(new google.maps.LatLng(-35.282267, 149.128741));
        });
        $("#hide").click(function(){
            $("#scroller").hide();
        });
        $("#show").click(function(){
            $("#scroller").show();
        });

        //resize function when window resize and hide ListView
        $(window).resize();
    }

    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);

    // Function of click list to show zoom and change center
    clickListToZoomAndCenter(markers, largeInfowindow);
}

// Resize function when window change
$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 850) {
        $("#scroller").hide();
    }else if ($(window).width() >= 850) {
        $("#scroller").show();
    }
});

// The function of click the list and then make zoom and change center of the map
function clickListToZoomAndCenter(marker, infowindow) {
    infowindow.marker = marker;

    //the information box show when click the ListView
    for(i=0; i<marker.length; i++) {
        var searchList = $('#list' + i);
        searchList.click((function(marker, i) {
            return function() {
                var content='';
                var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
                var wikiRequestTimeOut = setTimeout(function () {
                    content = "Failed to get wikipedia resources";
                },1000);
                $.ajax({
                    url:wikiURL,
                    dataType:'jsonp',
                    success: function (response) {
                        var articleList = response[1];
                        for (var i = 0; i<articleList.length; i++) {
                            articleStr = articleList[i];
                            var url = 'http://en.wikipedia.org/wiki/' + articleStr ;
                            content += '<li><a href="'+url+'">' + articleStr + '</a></li>';
                        };
                        clearTimeout(wikiRequestTimeOut);
                    }
                })
                infowindow.setContent('<div>' + '<strong>' +
                    marker.title + '</strong><br><p>' +
                    marker.streetAddress + '<br>' +
                    marker.cityAddress + '<br></p>' + '<hr><p>Wiki Information:</p>' + content + '</div>');

                infowindow.open(map,marker);
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                // location[i].picBoolTest = true;
            };
        })(marker[i],i));

    }
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        var content='';
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
        var wikiRequestTimeOut = setTimeout(function () {
            content = "Failed to get wikipedia resources";
        },1000);
        $.ajax({
            url:wikiURL,
            dataType:'jsonp',
            success: function (response) {
                var articleList = response[1];
                for (var i = 0; i<articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr ;
                    content += '<li><a href="'+url+'">' + articleStr + '</a></li>';
                };
                infowindow.setContent('<div>' + '<strong>' +
                    marker.title + '</strong><br><p>' +
                    marker.streetAddress + '<br>' +
                    marker.cityAddress + '<br></p>' + '<hr><p>Wiki Information:</p>' + content + '</div>');
                clearTimeout(wikiRequestTimeOut);
            }
        })
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

//Knockout.js view model
function MyViewModel() {
    var self = this;
    this.query = ko.observable('');
    this.markersSrc = [{
        title: 'National Museum of Australia',
        lat: ' -35.293189',
        lng: '149.121190',
        id: 'list0',
        streetAddress: 'Lawson Cres',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.293189, lng: 149.121190}
    },{
        title: 'National Library of Australia',
        lat: ' -35.296547',
        lng: '149.129837',
        id: 'list1',
        streetAddress: 'Parkes Pl W',
        cityAddress: 'Canberra ACT 2600, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.296547, lng: 149.129837}
    },{
        title: 'Australian War Memorial',
        lat: ' -35.281106',
        lng: '149.148334',
        id: 'list2',
        streetAddress: 'Treloar Cres',
        cityAddress: 'Campbell ACT 2612, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.281106, lng: 149.148334}
    },{
        title: 'Parliament House',
        lat: ' -35.307871',
        lng: '149.124189',
        id: 'list3',
        streetAddress: 'Parliament Dr',
        cityAddress: 'Canberra ACT 2600, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.307871, lng: 149.124189}
    },{
        title: 'The Australian National University',
        lat: ' -35.277997',
        lng: '149.118984',
        id: 'list4',
        streetAddress: 'Acton',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.277997, lng: 149.118984}
    },{
        title: 'Telstra Tower',
        lat: ' -35.275891',
        lng: '149.098601',
        id: 'list5',
        streetAddress: '100 Black Mountain Dr',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.275891, lng: 149.098601}
    }];
    // computer observable array to make filter function showing in the ListView
    this.markers = ko.computed(function() {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(self.markersSrc, function(marker) {
            if (marker.title.toLowerCase().indexOf(search) >= 0) {
                marker.mapVisible = true;
                return marker.listVisible(true);
            } else {
                marker.mapVisible = false;
                return marker.listVisible(false);
            }
        });
    },MyViewModel);
}
var ViewModel = new MyViewModel();

ko.applyBindings(ViewModel);


