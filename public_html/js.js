var elevator;
var map;
var chart;
var polyline;
var path = [];
var markers = [];
// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});
function initialize() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(36.578581, -118.291994),
        mapTypeId: 'terrain'
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
//            var infowindow = new google.maps.InfoWindow({
//                map: map,
//                position: pos,
//                content: 'Location found using HTML5.'
//            });
            map.setCenter(pos);
            jQuery('#transmiter-marker-lat,#receiver-marker-lat').attr('value', position.coords.latitude);
            jQuery('#transmiter-marker-lng,#receiver-marker-lng').attr('value', position.coords.longitude);
        }, function () {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
    // Create an ElevationService.
    elevator = new google.maps.ElevationService();
    google.maps.event.addListener(map, '\
click', function (e) {
        //console.log(e.latLng)
        if (markers.length == 0 || markers[0].title == 'receiver') {
            var title = 'transmiter';
        } else {
            title = 'receiver';
        }
        handleMarker(e.latLng, title, 'add');
    });

}
function formSubmit(title) {
    var action = 'add';
    if ($('#' + title + '-panel').hasClass('edit')) {
        action = 'edit';
    }
    var markerLat = $('input#' + title + '-marker-lat').val();
    var markerLng = $('input#' + title + '-marker-lng').val();
    var position = new google.maps.LatLng(markerLat, markerLng);

    handleMarker(position, title, action);
}
function editMarker(position, title) {
    if (markers[0].title == title) {
//            console.log('1');
        markers[0].setPosition(position);
//            console.log('1.1');
    } else if (markers[1].title == title) {
        markers[1].setPosition(position);
    } else {
        console.log('err');
    }
    map.panTo(position);
    drawPath();
}
function handleMarker(position, title, action) {
    if (action == 'edit') {
        editMarker(position, title)
        return;
    } else {
        if (markers.length < 2) {
            var col;
            if (markers.length > 0) {
                col = 'hide';
            } else {

                col = 'toggle';
            }
            if (title == 'transmiter') {
                var icon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10
                }
                $('#receiverCollapsible').collapse(col);
            } else {
                icon = '';
                $('#transmiterCollapsible').collapse(col);
            }
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                draggable: true,
                icon: icon,
                title: title,
            });
            $('#' + title + '-panel').addClass('edit');

            $('#' + title + 'Collapsible').collapse('hide');
            markers.push(marker);
        } else {
            return;
        }
    }


    map.panTo(position);

//    google.maps.event.addListener(marker, 'dragstart', function (e) {
//        console.log(e);
////        dragMarker(marker);
//
//    });
//    google.maps.event.addListener(marker, 'click', function () {
//        markerOpt(marker);
////        infowindow.open(marker.get('map'), marker);
//    });
    dragMarker(marker);
    drawPath();
}

function dragMarker(marker) {

    google.maps.event.addListener(marker, 'dragend', function (e) {
        if (markers.length == 2) {
            polyline.setMap(null);
        }
        jQuery('#' + marker.title + '-marker-lat').attr('value', marker.position.k);
        jQuery('#' + marker.title + '-marker-lng').attr('value', marker.position.D)
        drawPath()
    });
}

function markerOpt(marker) {
    console.log('ll')
    var custAltitude = '<div class="form-group">\n\
<label for="marker-altitude">Altitude</label>\n\
<input type="number" class="form-control" id="marker-altitude" placeholder="0.00">\n\
</div>';
    var removeBtn = '<a class="text-uppercase btn btn-sm btn-default btn-block" onclick = "markerRemove(\'' + marker.title + '\')"><span  class="glyphicon text-danger glyphicon-remove"></span> remove</a>';
    var editBnt = '<button class="text-uppercase btn btn-sm btn-block btn-default  type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" ><span class="glyphicon text-info glyphicon-map-marker"></span>edit</button >'
    var editOpt = '<div class="form-group collapse" id="collapseExample">\n\
<label for="marker-altitude">Lat</label>\n\
<input type="number" class="form-control" id="marker-altitude"  value="' + marker.position.D + '">\n\
<label for="marker-altitude">Long</label>\n\
<input type="number" class="form-control" id="marker-altitude" value="' + marker.position.k + '">\n\
</div'
    var infowindow = new google.maps.InfoWindow({
        content: '<label class="text-center btn-block">' + marker.title + '</label>' + custAltitude + editBnt + editOpt,
    });
//    console.log(marker.position)
    infowindow.open(marker.get('map'), marker);
}

function MarkerInfo(marker) {
    var markerPlaceholder = $('#' + marker.title + '-placeholder')
    console.log();
    var custAltitude = '<div class="form-group">\n\
<label for="' + marker.title + '-marker-altitude">Altitude</label>\n\
<input type="number" class="form-control" id="' + marker.title + '-marker-altitude" placeholder="0.00">\n\
</div>';
    var removeBtn = '<a class="text-uppercase btn btn-sm btn-default btn-block" onclick = "markerRemove(\'' + marker.title + '\')"><span  class="glyphicon text-danger glyphicon-remove"></span> remove</a>';
    var editBnt = '<button class="text-uppercase btn btn-sm btn-block btn-default  type="button" data-toggle="collapse" data-target="#collapse-' + marker.title + '" aria-expanded="false" ><span class="glyphicon text-info glyphicon-map-marker"></span>edit</button >'
    var editOpt = '<div class="form-group collapse" id="collapse-' + marker.title + '">\n\
<label for="' + marker.title + '-marker-lat">Lat</label>\n\
<input type="number" class="form-control" id="' + marker.title + '-marker-lat"  value="' + marker.position.D + '">\n\
<label for="' + marker.title + '-marker-long">Long</label>\n\
<input type="number" class="form-control" id="' + marker.title + '-marker-long" value="' + marker.position.k + '">\n\
</div'
    var editForm = '<label class="text-center btn-block">'
            + marker.title
            + '</label>'
            + custAltitude
            + editBnt
            + editOpt;
    markerPlaceholder.html(editForm);
}
function drawPath() {
//    console.log(markers);
    if (markers.length < 2) {
        return;
    }

// Create a new chart in the elevation_chart DIV.
    chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));
    var path = [markers[0].position, markers[1].position]
    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.
    var pathRequest = {
        'path': path,
        'samples': 256
    }

// Initiate the path request.
    elevator.getElevationAlongPath(pathRequest, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(results, status) {
    if (status != google.maps.ElevationStatus.OK) {
        return;
    }

    var elevations = results;
    // Extract the elevation samples from the returned results
    // and store them in an array of LatLngs.
    var elevationPath = [];
    for (var i = 0; i < results.length; i++) {
        elevationPath.push(elevations[i].location);
    }

// Display a polyline of the elevation path.
    var pathOptions = {
        path: elevationPath,
        strokeColor: '#000',
        opacity: 0.1,
        map: map
    }
    if (polyline != null) {
        polyline.setMap(null);
    }
    polyline = new google.maps.Polyline(pathOptions);
    // Extract the data from which to populate the chart.
    // Because the samples are equidistant, the 'Sample'
    // column here does double duty as distance along the
    // X axis.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < results.length; i++) {
        data.addRow(['', elevations[i].elevation]);
    }
//    console.log(data)
    if (!$('#elevation_chart_wrapper').hasClass('in')) {
        $('#elevation_chart_wrapper').collapse('show');
    }
    if ($('.elevation-chart-toggle').hasClass('hidden')) {
        $('.elevation-chart-toggle').removeClass('hidden')
    }
// Draw the chart using the data within its DIV.

    document.getElementById('elevation_chart').style.display = 'block';
    chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)'
    });
}

// On no Geolocation
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);

}

// Sets the map on all markers in the array.
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
    polyline.setMap(null);
    document.getElementById('elevation_chart').style.display = 'none';
    $('#receiver-placeholder,#transmiter-placeholder').html('');
}
//// Shows any markers currently in the array.
//// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

