
var elevator;
var map;
var infowindow = new google.maps.InfoWindow();
var denali = new google.maps.LatLng(63.3333333, -150.5);

function initialize() {
    var mapOptions = {
        zoom: 8,
        center: denali,
        mapTypeId: 'terrain'
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Create an ElevationService
    elevator = new google.maps.ElevationService();

    // Add a listener for the click event and call getElevation on that location
    google.maps.event.addListener(map, 'click', getElevation);
}
function ini() {

    var mapOptions = {
        center: new google.maps.LatLng(37.7831, -122.4039),
//        center: denali,
//        mapTypeId: google.maps.MapTypeId.ROADMAP
        mapTypeId: 'terrain',
        zoom: 8
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

//    var markerOptions = {
//        position: new google.maps.LatLng(37.7831, -122.4039),
//        map: map
//    };
//    var marker = new google.maps.Marker(markerOptions);
//    marker.setMap(map);

//    var infoWindowOptions = {
//        content: 'Moscone Is Here!'
//    };
//    var acOptions = {
//        types: ['establishment']
//    };
//    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), acOptions);
//    autocomplete.bindTo('bounds', map);
////    var infoWindow = new google.maps.InfoWindow();
////    var marker = new google.maps.Marker({
////        map: map
////    });
//
////    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
////    google.maps.event.addListener(marker, 'click', function (e) {
////
////        infoWindow.open(map, marker);
////
////    });
//
//    //autocomplete
//
//    google.maps.event.addListener(autocomplete, 'place_changed', function () {
//        infoWindow.close();
//        var place = autocomplete.getPlace();
//        if (place.geometry.viewport) {
//            map.fitBounds(place.geometry.viewport);
//        } else {
//            map.setCenter(place.geometry.location);
//            map.setZoom(17);
//        }
//        marker.setPosition(place.geometry.location);
//        infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
//        infoWindow.open(map, marker);
//        google.maps.event.addListener(marker, 'click', function (e) {
//
//            infoWindow.open(map, marker);
//
//        });
//    });
//

// Create an ElevationService
    elevator = new google.maps.ElevationService();

    // Add a listener for the click event and call getElevation on that location
    google.maps.event.addListener(map - canvas, 'click', getElevation);
}


function getElevation(event) {

    var locations = [];

    // Retrieve the clicked location and push it on the array
    var clickedLocation = event.latLng;
    locations.push(clickedLocation);

    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest = {
        'locations': locations
    }

    // Initiate the location request
    elevator.getElevationForLocations(positionalRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK) {

            // Retrieve the first result
            if (results[0]) {

                // Open an info window indicating the elevation at the clicked position
                infowindow.setContent('The elevation at this point <br>is ' + results[0].elevation + ' meters.');
                infowindow.setPosition(clickedLocation);
                infowindow.open(map);
            } else {
                alert('No results found');
            }
        } else {
            alert('Elevation service failed due to: ' + status);
        }
    });
}
google.maps.event.addDomListener(window, 'load', ini);
//google.maps.event.addDomListener(window, 'load', initialize);