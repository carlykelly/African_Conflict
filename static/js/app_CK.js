// Creating map object

var baseMaps
  // Adding tile layer

  
  // Load in geojson data
  var geoData = "/static/js/AfricaGeoJson.json";
  
  var ethnicity;
  var gdpGrowth;
  var conflict;
  var outlineLayer
  var outline
  
  // Grab data with d3
  d3.json(geoData).then(function(data) {
  
      console.log(data)
    // Create a new choropleth layer
    ethnicity = L.choropleth(data, {
  
      // Define what  property in the features to use
      valueProperty: "Diversity_Percentage",
  
      // Set color scale
      scale: ["#ffffb2", "#006200"],
  
      // Number of breaks in step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "black",
        weight: 1,
        fillOpacity: 0.7
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name  + "<br>Percent of Population Diversity:<br>" +
         feature.properties.Diversity_Percentage);
      }
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ethnicity.options.limits;
      var colors = ethnicity.options.colors;
      var labels = [];
      // Add min & max
      var legendInfo = "<h6>Diversity Percentage</h6>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
      div.innerHTML = legendInfo;
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
    // Adding legend to the map


      gdpGrowth = L.choropleth(data, {
  
        // Define what  property in the features to use
        valueProperty: "GDP_Growth_2018",
    
        // Set color scale
        scale: ["#ffffb2", "#b10026"],
    
        // Number of breaks in step range
        steps: 10,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "black",
          weight: 1,
          fillOpacity: 0.7
        },
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name + "<br>GDP Percent Growth in 2018:<br>" +
           feature.properties.GDP_Growth_2018);
        } 
      });

      var legendCase = L.control({ position: "bottomright" });
      legendCase.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = gdpGrowth.options.limits;
        var colors = gdpGrowth.options.colors;
        var labels = [];
        // Add min & max
        var legendInfo = "<h6>GDP Percent Growth in 2018</h6>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
        div.innerHTML = legendInfo;
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };

      conflict = L.choropleth(data, {
  
        // Define what  property in the features to use
        valueProperty: "Conflicts_2018",
    
        // Set color scale
        scale: ["#ffffff", "#E1AD01"],
    
        // Number of breaks in step range
        steps: 10,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "black",
          weight: 1,
          fillOpacity: 0.7
        },
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name  + "<br>Number of Conflicts in 2018:<br>" +
           feature.properties.Conflicts_2018);
        }
      });
      var legendMort = L.control({ position: "bottomright" });
      legendMort.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = conflict.options.limits;
        var colors = conflict.options.colors;
        var labels = [];
        // Add min & max
        var legendInfo = "<h6>Instances of Conflicts in 2018</h6>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
        div.innerHTML = legendInfo;
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };


        baseMaps = {
          "Diversity Rate": ethnicity,
          "GDP Growth Rate": gdpGrowth,
          "Instances of Conflict": conflict
        }
      
        var myMap = L.map("choropleth", {
          center: [-8.7832, 34.5085],
          zoom: 3,
          layers: ethnicity
        });
        legend.addTo(myMap);

          L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/light-v9",
            accessToken: 'sk.eyJ1IjoiY2FybHlma2VsbHkiLCJhIjoiY2tkZ3U4Z3B3Mmx6dDJ4cG16Y2l6eWQ1bCJ9.ewwhVCi9nw45LL2iNZ1hbA'
          }).addTo(myMap);

        L.control.layers(baseMaps, null, {collapsed:false}).addTo(myMap);

        myMap.on('baselayerchange',function(eventlayer){
          this.removeControl(legend)
          this.removeControl(legendMort)
          this.removeControl(legendCase)
          if(outline){
            if(state == 'us'){
              myMap.removeLayer(outline)
            }
            else{
            myMap.removeLayer(outline)
            outline.addTo(myMap)
            }
            }
          if(eventlayer.name == 'GDP Growth Rate'){
            legendCase.addTo(myMap)
          }
          if(eventlayer.name == 'Diversity Rate'){
            legend.addTo(myMap)
          }
          if(eventlayer.name == 'Instances of Conflict'){
            legendMort.addTo(myMap)
          }
        })
    })