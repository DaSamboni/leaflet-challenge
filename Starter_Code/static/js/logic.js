//Storing URL as a variable
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//URL query
d3.json(queryURL).then(function (data) {
    console.log("data:", data)
    makeFeatures(data.features);
});


function makeFeatures(earthquakeData){
        function onEachFeature(feature, layer) {
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr>
                          <p>${"Magnitude "+feature.properties.mag}<hr> <p>${"Depth of earthquake "+feature.geometry.coordinates[2]}`);
                         
        }

//Create datamarkers with size reflecting magnitude and color representing depth
function makeDatamarker(feature){
    let style = {
    radius: (feature.properties.mag) * 2.75,
    fillColor: colorChange(feature.geometry.coordinates[2]),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 1

 }
 return L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],style);
}

//Function to assign colors depending on earthquake depth
function colorChange(depth){
    if (depth < 10) return "green";
    else if (depth < 25) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 75) return "orange";
    else if (depth < 90) return "orangered";
    else return "red";
};

//Making GeoJSON layer with features array + running onEachFeature function for each piece of data
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: makeDatamarker
});
makeMap(earthquakes)

function makeMap(earthquakes) {
    //Base layers
    let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

    })
    let topographical = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
   
      //baseMaps object
    let baseMaps = {
        "Street Map": streets,
        "Topographical Map": topographical
    };

    //Overlay object
    let overlayLevel = {
        Earthquakes: earthquakes
    };

    //Creating map and adding street map/earthquake layers
    let myMap = L.map("map", {
        center: [30, 0],
        zoom: 2.5,
        layers: [streets, earthquakes]
    });

    //Legend creation
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend")
        let depth = ["<10", "10-25", "25-50", "50-75", "75-90", ">90"];
        let chooseColor = ["green", "greenyellow", "yellow", "orange", "orangered", "red"];
        let labels = [];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap)

};
};