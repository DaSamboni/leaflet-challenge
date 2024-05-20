//Storing URL as a variable
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//URL query
d3.json(queryURL).then(function (data) {
    console.log("data:", data)
    makeFeatures(data.features);
});

//Making a hover-over menu for each earthquakes' location and time
function makeFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>$
        {"Depth: " + feature.geometry.coordinates[2]} <p>${"Magnitude: " + feature.properties.mag}<hr>`)};
    
    }




