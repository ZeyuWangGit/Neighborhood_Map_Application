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
        var markerA = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            streetAddress: ViewModel.markersSrc[i].streetAddress,
            cityAddress: ViewModel.markersSrc[i].cityAddress,
            icon: defaultIcon,
            mapVisible: true
        });
        // Push the marker to our array of markers.
        markers.push(markerA);

        //marker's response when click, mouseover and mouseout
        markerA.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleDrop(this);
        });

        markerA.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        markerA.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        //Reset, show and hide button
        $( "#btn-class" ).click(function() {
            map.setZoom(14);
            map.setCenter(new google.maps.LatLng(-35.282267, 149.128741));
            reset();
            setAllMap();
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
    $('.google-map__trigger-item').each(function(i){
        $(this).on('click', function(){
            google.maps.event.trigger(markers[i], 'click');
        });
        $(this).on('mouseover', function(){
            google.maps.event.trigger(markers[i], 'mouseover');
        });
        $(this).on('mouseout', function(){
            google.maps.event.trigger(markers[i], 'mouseout');
        });
    });

    setAllMap();
    changeBound();


}

// set Markers in the map
function setAllMap() {
    // var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        if(ViewModel.markersSrc[i].mapVisible === true) {
            markers[i].setMap(map);
         }
         else {
            markers[i].setMap(null);
        }
    }
}

function changeBound() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// Reset markers after filter
function reset() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].mapVisible = true;
    }
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

function OpenInfowindowForMarker(index) {
    google.maps.event.trigger(markers[index], 'click');
}
function highlightedIconForMarker(index) {
    google.maps.event.trigger(markers[index], 'mouseover');
}
function defaultIconForMarker(index) {
    google.maps.event.trigger(markers[index], 'mouseout');
}
function toggleDrop(markerB) {
    markerB.setAnimation(google.maps.Animation.DROP);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(markerC, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != markerC) {
        infowindow.marker = markerC;
        var content='';
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + markerC.title + '&format=json&callback=wikiCallback';
        var wikiRequestTimeOut = setTimeout(function () {
            infowindow.setContent("Failed to get wikipedia resources");
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
                    markerC.title + '</strong><br><p>' +
                    markerC.streetAddress + '<br>' +
                    markerC.cityAddress + '<br></p>' + '<hr><p>Wiki Information:</p>' + content + '</div>');
                clearTimeout(wikiRequestTimeOut);
            }
        })
        infowindow.open(map, markerC);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        map.setZoom(16);
        map.setCenter(markerC.position);
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
        id: '0',
        streetAddress: 'Lawson Cres',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.293189, lng: 149.121190},
        className: 'google-map__trigger-item'
    },{
        title: 'National Library of Australia',
        lat: ' -35.296547',
        lng: '149.129837',
        id: '1',
        streetAddress: 'Parkes Pl W',
        cityAddress: 'Canberra ACT 2600, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.296547, lng: 149.129837},
        className: 'google-map__trigger-item'
    },{
        title: 'Australian War Memorial',
        lat: ' -35.281106',
        lng: '149.148334',
        id: '2',
        streetAddress: 'Treloar Cres',
        cityAddress: 'Campbell ACT 2612, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.281106, lng: 149.148334},
        className: 'google-map__trigger-item'
    },{
        title: 'Parliament House',
        lat: ' -35.307871',
        lng: '149.124189',
        id: '3',
        streetAddress: 'Parliament Dr',
        cityAddress: 'Canberra ACT 2600, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.307871, lng: 149.124189},
        className: 'google-map__trigger-item'
    },{
        title: 'The Australian National University',
        lat: ' -35.277997',
        lng: '149.118984',
        id: '4',
        streetAddress: 'Acton',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.277997, lng: 149.118984},
        className: 'google-map__trigger-item'
    },{
        title: 'Telstra Tower',
        lat: ' -35.275891',
        lng: '149.098601',
        id: '5',
        streetAddress: '100 Black Mountain Dr',
        cityAddress: 'Acton ACT 2601, Australia',
        listVisible: ko.observable(true),
        mapVisible: true,
        location: {lat: -35.275891, lng: 149.098601},
        className: 'google-map__trigger-item'
    }];
    // computer observable array to make filter function showing in the ListView
    this.markers1 = ko.computed(function() {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(self.markersSrc, function(marker1) {
            if (marker1.title.toLowerCase().indexOf(search) !== -1) {
                marker1.mapVisible = true;
                setAllMap();
                    console.log(markers);
                if(search === ""){
                    marker1.mapVisible = true;
                }
                    return marker1.listVisible(true);
            } else {
                    marker1.mapVisible = false;
                    markers[marker1.id].mapVisible = false;
                    setAllMap();
                    return marker1.listVisible(false);
            }
        });
    },MyViewModel);
}
var ViewModel = new MyViewModel();

ko.applyBindings(ViewModel);

function mapError() {
    alert("Google Map Connection Error! Check your internet or ask Google for help!")
}


