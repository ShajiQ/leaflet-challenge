// Step 1: Get your dataset's URL (e.g., "All Earthquakes from the Past 7 Days")
var datasetURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Step 2: Create a Leaflet map
var map = L.map('map').setView([0, 0], 2);

// Step 2 (Continued): Add a basemap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Step 2 (Continued): Load and plot earthquake data
fetch(datasetURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];

                var markerOptions = {
                    radius: Math.max(magnitude, 1) * 5,
                    fillColor: getColor(depth),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                };

                return L.circleMarker(latlng, markerOptions);
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    "Magnitude: " + feature.properties.mag + "<br>" +
                    "Location: " + feature.properties.place
                );
            },
        }).addTo(map);

        // Step 3: Create a legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 10, 50, 100];
            var labels = [];

            for (var i = 0; i < depths.length; i++) {
                labels.push(
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(map);
    });

// Step 2 (Continued): Define a function to set marker color based on depth
function getColor(depth) {
    if (depth < 10) return "lightgreen";
    else if (depth < 50) return "yellow";
    else if (depth < 100) return "orange";
    else return "red";
}