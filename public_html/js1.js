var elevator;
var map;
var chart;
var polyline;
var path = [];
// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

function initialize() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(36.578581, -118.291994),
        mapTypeId: 'terrain'
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Create an ElevationService.
    elevator = new google.maps.ElevationService();
    google.maps.event.addListener(map, 'click', function (e) {
        placeMarker(e.latLng, map);
    });
}


function placeMarker(position, map) {
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });

    // add points
    path.push(position);
    // pan to last point
    map.panTo(position);

    // Draw the path, using the Visualization API and the Elevation service.
    drawPath();

    google.maps.event.addListener(marker, 'click', function () {
        markerOpt(marker);
        // infowindow.open(marker.get('map'), marker);
    });
}
function markerRemove() {
    console.log('remove')
}
function markerOpt(marker) {
    var infowindow = new google.maps.InfoWindow({
        content:
                '<button onclick = "markerRemove()">remove</button><br>\n\
            <input type="text" id="cust-altitude">'
    });

    infowindow.open(marker.get('map'), marker);

}

function drawPath() {

    if (path.length < 2) {
        return;
    }
    // Create a new chart in the elevation_chart DIV.
    chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

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

    // Draw the chart using the data within its DIV.
    document.getElementById('elevation_chart').style.display = 'block';
    chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)'
    });
}

google.maps.event.addDomListener(window, 'load', initialize);