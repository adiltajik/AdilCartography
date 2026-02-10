var map = L.map('map').setView([20, 0], 2);

// Basemaps
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles © Esri' }
);

// COLOR SCHEME FROM YOUR PDF
function getColor(d) {
    return d > 20000000 ? '#cc0000' :
           d > 10000000 ? '#b6d7a8' :
           d > 5000000  ? '#ffff00' :
           d > 1000000  ? '#ff9900' :
                         '#2ca02c';
}

// STYLE
function style(feature) {
    return {
        fillColor: getColor(feature.properties.Shape_Area), // ✅ FIXED PROPERTY
        weight: 1,
        color: "black",
        fillOpacity: 0.8
    };
}

// HOVER EFFECT
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#000',
        fillOpacity: 1
    });
    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

// POPUPS
function onEachFeature(feature, layer) {
    let popup = "<b>Country Data</b><br>";
    for (let key in feature.properties) {
        popup += `<b>${key}</b>: ${feature.properties[key]}<br>`;
    }
    layer.bindPopup(popup);

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// LOAD GEOJSON
var geojson;
fetch("adilclip.json")
    .then(res => res.json())
    .then(data => {
        var feature30 = data.features[29];
        geojson = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.fitBounds(geojson.getBounds());

        // Layer control must be added AFTER geojson loads
        L.control.layers(
            {"OpenStreetMap": osm, "Satellite": satellite},
            {"Country Layer": geojson}
        ).addTo(map);
    });

// LEGEND
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<b>Classification</b><br>";
    div.innerHTML += '<i style="background:#2ca02c"></i> Low<br>';
    div.innerHTML += '<i style="background:#ff9900"></i> Medium<br>';
    div.innerHTML += '<i style="background:#ffff00"></i> High<br>';
    div.innerHTML += '<i style="background:#b6d7a8"></i> Very High<br>';
    div.innerHTML += '<i style="background:#cc0000"></i> Extreme';
    return div;
};

legend.addTo(map);
0