// html_v6, app_v6.py
//NOTES:

//To do:
// - link drop down to map highlight
// - ability to select fdi year to be used for scatter plot & select number of year in the future to visualize fdi affect on coutnry
// - ability to plot a metric using a selection box 

// event squence:
// open page > africa map > you select a country > FDI barchart > select a checkbox > add a line to the >
// > bargraph to that represents the checkbox option.  

// Process flow scenarios legend:
//    1) initial page load: 
//    2) click on country from drop down > DDEL > FEPJDD > FEPJ > BG & BSS > country graph & ticker displayed on page
//    3) click on country from map        > MEL > FEPJDD > FEPJ > BG & BSS > country graph & ticker displayed on page
//    4) click on country graph buttons:
//    5) click on SSA scatter graph buttons:

var endpoint = '/ultimate'
  var selected_country = ''

var indexSelector_line1 = 1; 
var indexSelector_line2 = 1;
var indexSelector = 0;
var fdi_vs_metric = 0;

// Creating map object

var baseMaps
  // Adding tile layer

  
  // Load in geojson data
  var geoData = "/static/js/AfricaGeoJson.json";
  
  var ethnicity;
  var gdpGrowth;
  var conflict;
  var outline
  var corruption

  var scatter_array = [] // array will contain the above objects. will be used to build the scatter graph
  var selected_country_json_array = [] //?????


  var clickflag = 0 /// testing click envent gold
  var old_layer = '' // testing click envent gold

  var polygon_country_indx // to identify the countries polygon id

  
  $('.index').hide()
  $('.scatter').hide()

  var country_dict = []
  var dict_key = 0

  //(BSS) vvvvvvvvvvvvvvvv TICKER: SELECTED COUNTRY 2018 SNAPSHOT vvvvvvvvvvvv
    function buildsnapshot() {
      var panel = d3.select('#sample-metadata');
      var ticker = '';
      panel.html("");
      selected_country_json_array.forEach(rec => {
        var series = rec[0]['series'];
        var year = rec[0]['2018'];
        ticker = ticker + series + ': ' + year + ' <> ';
      });
      panel.append('marquee').text(ticker);
    }
//   //^^^^^^^^^^^^^^^^ TICKER: SELECTED COUNTRY 2018 SNAPSHOT ^^^^^^^^^^^^^
  
  // Grab data with d3
  d3.json(geoData).then(function(data) {
  // (BPDD) vvvvvvvvvvvvvv BUILD & POPULATE DROPDOWN VALUES AND FILTER NONE SUB-SAHARAN COUTNRIES vvvvvvvvvvvv
  function builddropdown(){
    var ddmenu = d3.select('#selDataset')
    ddmenu.append('option').text('All African Countries') //// Add to the drop down  "All SUB-SAHARAN Countries" as an option
    data.features.forEach(c =>  {
        var country_name = c.properties.name
        ddmenu.append('option').text(country_name)
    });     
  };
    // (BPDD) ^^^^^^^^^^^^^^^^^^ BUILD & POPULATE DROPDOWN VALUES AND FILTER NONE SUB-SAHARAN COUTNRIES ^^^^^^^^^^

  builddropdown()

      console.log(data)
    // Create a new choropleth layer
    ethnicity = L.choropleth(data, {
        onEachFeature: function(feature, layer) {
            // Set mouse events to change map styling
            country_name = feature.properties.name;

            // if(not_ssa.indexOf(country_name) === -1){
            layer.on({ //// ?????? get it later
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                //console.log(event.target)
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function mouseout_func(event) {    
                //console.log(event.target)     
                ////// TESTING: if country is clicked then mouseout funtion should not work ///////////
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 1
                        });              
                    }
                },
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    console.log(event.target)  
                

                    selected_country = feature.properties.name
                    d3.select('#selDataset').node().value = selected_country 
                    //filter_endpointJsonDD()
                     console.log('WORKING!')                       
                    layer = event.target;
                    console.log(layer)
                    layer.setStyle({
                        color: 'black',
                        weight: 5
                    });    

                    if(clickflag == 0){
                        old_layer = layer
                        clickflag ++
                    }
                
                    if(old_layer != layer){
                        old_layer.setStyle({
                            color: 'black',
                            weight: 1
                        });  

                        old_layer = layer
                    }   
            
                },    

            });
        },
      // Define what  property in the features to use
      valueProperty: "Diversity_Percentage",
  
      // Set color scale
      scale: ["#ffffb2", "#E1AD01"],
  
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
    //   onEachFeature: function(feature, layer) {
    //     layer.bindPopup(feature.properties.name  + "<br>Percent of Population Diversity:<br>" +
    //      feature.properties.Diversity_Percentage);
    //   }
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
        onEachFeature: function(feature, layer) {
            // Set mouse events to change map styling
            country_name = feature.properties.name;

            // if(not_ssa.indexOf(country_name) === -1){
            layer.on({ //// ?????? get it later
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                //console.log(event.target)
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function mouseout_func(event) {    
                //console.log(event.target)     
                ////// TESTING: if country is clicked then mouseout funtion should not work ///////////
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 1
                        });              
                    }
                },
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    console.log(event.target)  
                

                    selected_country = feature.properties.name
                    d3.select('#selDataset').node().value = selected_country 
                    //filter_endpointJsonDD()
                     console.log('WORKING!')                       
                    layer = event.target;
                    console.log(layer)
                    layer.setStyle({
                        color: 'black',
                        weight: 5
                    });    

                    if(clickflag == 0){
                        old_layer = layer
                        clickflag ++
                    }
                
                    if(old_layer != layer){
                        old_layer.setStyle({
                            color: 'black',
                            weight: 1
                        });  

                        old_layer = layer
                    }   
            
                },    

            });
        },
        // Define what  property in the features to use
        valueProperty: "GDP_Growth_2018",
    
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
        // Binding a pop-up to each layer
        // onEachFeature: function(feature, layer) {
        //   layer.bindPopup(feature.properties.name + "<br>GDP Percent Growth in 2018:<br>" +
        //    feature.properties.GDP_Growth_2018);
        // } 
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
  
        onEachFeature: function(feature, layer) {
            // Set mouse events to change map styling
            country_name = feature.properties.name;

            // if(not_ssa.indexOf(country_name) === -1){
            layer.on({ //// ?????? get it later
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                //console.log(event.target)
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function mouseout_func(event) {    
                //console.log(event.target)     
                ////// TESTING: if country is clicked then mouseout funtion should not work ///////////
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 1
                        });              
                    }
                },
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    console.log(event.target)  
                

                    selected_country = feature.properties.name
                    d3.select('#selDataset').node().value = selected_country 
                    //filter_endpointJsonDD()
                     console.log('WORKING!')                       
                    layer = event.target;
                    console.log(layer)
                    layer.setStyle({
                        color: 'black',
                        weight: 5
                    });    

                    if(clickflag == 0){
                        old_layer = layer
                        clickflag ++
                    }
                
                    if(old_layer != layer){
                        old_layer.setStyle({
                            color: 'black',
                            weight: 1
                        });  

                        old_layer = layer
                    }   
            
                },    

            });
        },
        // Define what  property in the features to use
        valueProperty: "Conflicts_2018",
    
        // Set color scale
        scale: ["#ffffff", "#b10026"],
    
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
        // onEachFeature: function(feature, layer) {
        //   layer.bindPopup(feature.properties.name  + "<br>Number of Conflicts in 2018:<br>" +
        //    feature.properties.Conflicts_2018);
        // }
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

      corruption = L.choropleth(data, {
  
        onEachFeature: function(feature, layer) {
            // Set mouse events to change map styling
            country_name = feature.properties.name;

            // if(not_ssa.indexOf(country_name) === -1){
            layer.on({ //// ?????? get it later
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                //console.log(event.target)
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function mouseout_func(event) {    
                //console.log(event.target)     
                ////// TESTING: if country is clicked then mouseout funtion should not work ///////////
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 1
                        });              
                    }
                },
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    console.log(event.target)  
                

                    selected_country = feature.properties.name
                    d3.select('#selDataset').node().value = selected_country 
                    //filter_endpointJsonDD()
                     console.log('WORKING!')                       
                    layer = event.target;
                    console.log(layer)
                    layer.setStyle({
                        color: 'black',
                        weight: 5
                    });    

                    if(clickflag == 0){
                        old_layer = layer
                        clickflag ++
                    }
                
                    if(old_layer != layer){
                        old_layer.setStyle({
                            color: 'black',
                            weight: 1
                        });  

                        old_layer = layer
                    }   
            
                },    

            });
        },
        // Define what  property in the features to use
        valueProperty: "Corruption_2018",
    
        // Set color scale
        scale: ["#ffffff", "#1520A6"],
    
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
        // onEachFeature: function(feature, layer) {
        //   layer.bindPopup(feature.properties.name  + "<br>Number of Conflicts in 2018:<br>" +
        //    feature.properties.Conflicts_2018);
        // }
      });
      var legendCorupt = L.control({ position: "bottomright" });
      legendCorupt.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = corruption.options.limits;
        var colors = corruption.options.colors;
        var labels = [];
        // Add min & max
        var legendInfo = "<h6>Corruption Score in 2018</h6>" +
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
          "Instances of Conflict": conflict,
          "Corruption Score": corruption
        }
      
        var myMap = L.map("map", {


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
          this.removeControl(legendCorupt)

          if(eventlayer.name == 'GDP Growth Rate'){
            legendCase.addTo(myMap)
          }
          if(eventlayer.name == 'Diversity Rate'){
            legend.addTo(myMap)
          }
          if(eventlayer.name == 'Instances of Conflict'){
            legendMort.addTo(myMap)
          }
          if(eventlayer.name == 'Corruption Score'){
            legendCorupt.addTo(myMap)
          }
        })
    })


//   //^^^^^^^^^^^^^^^^ TICKER: SELECTED COUNTRY 2018 SNAPSHOT ^^^^^^^^^^^^^


  //(BSGSSA)vvvvvvvvvvvvvvvv BUILD SCATTER GRAPH vvvvvvvvvvvvvvvvvvv
    function build_scatter(scatter_array){
        var text = Object.keys(scatter_array[0])
        var x_axis = Object.values(scatter_array[0])
        var y_axis = Object.values(scatter_array[fdi_vs_metric])           

        var trace1 = {
          x: x_axis,
          y:  y_axis,
          mode: 'markers',
          type: 'scatter',
          name: 'Sub-Saharan Country',
          text: text,
          marker: { size: 12 }
        };
        
        var data = [trace1];
        
        var layout = {
          xaxis: {
            title: `${selected_country_json_array[0][indexSelector]['series']}`
          },
          yaxis: {
            title: `${selected_country_json_array[fdi_vs_metric][0]['series']}`
          },
          title:`${selected_country} ${selected_country_json_array[0][indexSelector]['series']} vs ${selected_country_json_array[fdi_vs_metric][0]['series']} `,
          showlegend: true,
            legend: {"orientation": "h"}
        };

        
        Plotly.newPlot('one', data, layout);

    }    
    // (BSGSSA)^^^^^^^^^^^^^^^^^^^^^ BUILD SCATTER GRAPH ^^^^^^^^^^^^^^^ 
  
   
 //(SD) vvvvvvvvvvvvvvvv SCATTER PLOT: BUILDING AN OBJECT from every endpoint for the year 2018 vvvvvvvvvvvvvvvvvvvv
 //vvvvvvvvvvvvvvvv ie. for the FDI endpoint the result will be {country_name:amount of FDI injected} vvvvvvvvv
 //vvvvvvvvvvvvvvvv assumption: it will take 5 years for the effects of FDI to take place vvvvvvvvvvvvvvvvvvvvv
    function scatter_data(){

      indexEndPoints.forEach(iep => {
        d3.json(iep).then(data => {
          if (indexEndPoints.length > 0){
            data.forEach(c => {

              var obj_key = c.country_name
              
              if (c.series == 'FDI'){
                var obj_val = c['2005']
              }
              else {
                var obj_val = c['2009']
              }
          
              if (c.series == 'FDI') { 
                fdi_obj[`${obj_key}`] = obj_val
                scatter_array[0] = (fdi_obj)
              }

              else if (c.series == 'GDP') { 
                gdp_obj[`${obj_key}`] = obj_val
                scatter_array[1] = (gdp_obj)
              }

              else if (c.series == 'GNI Per Capita') { 
                gni_c_obj[`${obj_key}`] = obj_val
                scatter_array[2] = (gni_c_obj) 
              }   

              else if (c.series == 'GDP Per Capita') { 
                gdp_c_obj[`${obj_key}`] = obj_val 
                scatter_array[3] = (gdp_c_obj) 
              }

              else if (c.series == 'Health Expenditure') { 
                he_obj[`${obj_key}`] = obj_val
                scatter_array[4] = (he_obj) 
              }

              else if (c.series == 'Life Expectancy') { 
                le_obj[`${obj_key}`] = obj_val
                scatter_array[5] = (le_obj)            
              }

              else if (c.series == 'Human Development Index') {
                hd_obj[`${obj_key}`] = obj_val
                scatter_array[6] = (hd_obj)           
              }

              else if (c.series == 'Education Index') { 
                edu_obj[`${obj_key}`] = obj_val
                scatter_array[7] = (edu_obj)
              }

              else if (c.series == 'Political Stability') { 
                ps_obj[`${obj_key}`] = obj_val
                scatter_array[8] = (ps_obj)
              }

              else if (c.series == 'Corruption Index') { 
                corr_obj[`${obj_key}`] = obj_val
                scatter_array[9] = (corr_obj)
              }

            })
          }
        build_scatter(scatter_array)
        }); 
      }); 
    };
  // (SD)^^^^^^^^^^^^^^^^ SCATTER PLOT: BUILDING AN OBJECT from every endpoint for the year 2018 ^^^^^^^^^^^^^^^^^^^^
  //^^^^^^^^^^^^^^^^ ie. for the FDI endpoint the result will be {country_name:amount of FDI injected} ^^^^^^^^^
  //^^^^^^^^^^^^^^^^ assumption: it will take 5 years for the effects of FDI to take place ^^^^^^^^^^^^^^^^^^^^^

      
  //(BG) vvvvvvvvvvvvvvvvvvv BUILDING COUNTRY GRAPH vvvvvvvvvvvvvvvvvvvvvv
    function build_graph() {
       // console.log(selected_country_json_array)
      var x_fdi = Object.keys(selected_country_json_array[indexSelector][0]).slice(0,19);
      var y_fdi = Object.values(selected_country_json_array[indexSelector][0]).slice(0,19);
      //console.log(x_fdi)
    //   console.log(y_fdi)


      var x_gdp_c = Object.keys(selected_country_json_array[indexSelector_line1][0]).slice(0,19);
      var y_gdp_c = Object.values(selected_country_json_array[indexSelector_line1][0]).slice(0,19)
    //   console.log(x_gdp_c)
    //   console.log(y_gdp_c)

      var x_gni_c = Object.keys(selected_country_json_array[indexSelector_line2][0]).slice(0,19);
      var y_gni_c = Object.values(selected_country_json_array[indexSelector_line2][0]).slice(0,19)
    //   console.log(x_gni_c)
    //   console.log(y_gdp_c)

        var fdi_trace = {
          x: x_fdi,
          y: y_fdi,
          name: `FDI`,
          type: 'bar',
          marker: {color: '#DAA520',
          },
          connectgaps: true
        }
        
        var first_trace = {
          x: x_gdp_c,
          y: y_gdp_c,
          name: `${selected_country_json_array[indexSelector_line1][0]['series']}`,
          yaxis: 'y2',
          type: 'line',
          line: {color: 'red'
          },
          connectgaps: true
        }

        var second_trace = {
            x: x_gni_c,
            y: y_gni_c,
            name: `${selected_country_json_array[indexSelector_line2][0]['series']}`,
            yaxis: 'y2',
            type: 'line',
            line: {color: 'blue'
            },
            connectgaps: true
          }

        var data = [fdi_trace, first_trace, second_trace]

        var layout = {
          title: `${selected_country_json_array[0][0]['country_name']} FDI vs. ${selected_country_json_array[indexSelector_line1][0]['series']} & ${selected_country_json_array[indexSelector_line2][0]['series']}`,
          yaxis: {title: 'FDI'},
          yaxis2: {
            title: `${selected_country_json_array[indexSelector_line1][0]['series']} & ${selected_country_json_array[indexSelector_line2][0]['series']}`,
            overlaying: 'y',
            side: 'right'
          },
          showlegend: true,
            legend: {"orientation": "h"},
          connectgaps: true
        };
        var config2 = {responsive : true}
        Plotly.newPlot("one", data, layout, config2)
    }
  //(BG)^^^^^^^^^^^^^^^^ BUILDING COUNTRY GRAPH ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



  //(FEPJ)vvvvvvvvvvvvvvvvv USE SELECTED COUNTRY FROM DROPDOWN/MAP TO FILTER GEOJSON vvvvvvvvvvvvvvvvvvvvvvv 
  //Not used in new geojson
  //data filter
    // function filter_endpointJson(selected_country){ 
    //   indexEndPoints.forEach(iep => {
        
    //     d3.json(iep).then(data => {
    //       if (indexEndPoints.length > 0){
    //         var selected_country_json = data.filter(d => selected_country == d.country_name)
    //         selected_country_json_array[selected_country_json[0]['id']] = selected_country_json
    //       }
    //       //PLOT Construction
    //       build_graph()

    //       buildsnapshot()
    //     }); 
    //   });    
    // };
  //(FEPJ)^^^^^^^^^^^^^^^^^^^^^ USE SELECTED COUNTRY FROM DROPDOWN/MAP TO FILTER GEOJSON ^^^^^^^^^^^^^^^^^^^


  
  //(FEPJDD)vvvvvvvvvvvvvv SET SELECTED COUNTRY TO VALUE OF DROP DOWN SELECTION vvvvvvvvvvvvvvv
  function filter_endpointJsonDD(){
    indexSelector = 0;
    selected_country = d3.select('#selDataset').node().value

    if (selected_country != 'All Sub-Saharan Countries') {
      $('.index').show()
      $('.scatter').hide()
      indexSelector_line1 = 2 // put to sleep: display no line graphs
      indexSelector_line2 = 3 // put to sleep: display no line graphs
      filter_endpointJson(selected_country)  
      //make a call to the click listener function 
    }

    else {
      $('.index').hide()
      $('.scatter').show()

      scatter_data();
      fdi_vs_metric = 1
    }

    /// to identify each contires index in the geojeson
        data.features.forEach(c => {
            country_dict.push({
                key: dict_key,
                value: c.properties.name 
            })
            dict_key++
        }) 
        console.log(country_dict)

        var country_obj = country_dict.filter(c => selected_country == c.value )
        polygon_country_indx = country_obj[0]['key']
        var x = document.getElementsByClassName("leaflet-interactive")[polygon_country_indx];
        var att = document.createAttribute("id"); 
        att.value = `${selected_country}`; 
        x.setAttributeNode(att)
        console.log(x)

        $('#Angola').find('path').trigger('click'); // Works

        // $(`${selected_country}`).on("click", "path", function(){
        //     $(this).text("It works!");
        // }); ///////////////////doesnt work
        // $(`${selected_country}`).ready(function(){
        //     $("path").trigger("click");
        // }); ///////////////////doesnt work
        // $(`#${selected_country}`).trigger(click);
        // $(`#${selected_country}`).click(); ///////////////////doesnt work

        // $( `#${selected_country}` ).click(function() {
        //     console.log( "Handler for .click() called." );
        //   }); ///////////////////doesnt work
        // document.getElementById(`${selected_country}`).click() ///////////////////doesnt work
        //document.getElementsByClassName("leaflet-interactive").click() ///////////////////doesnt work
        //d3.select("#selDataset").on("change",console.log(mapData))///???????

    /// to identify each contires index in the geojeson

  };
    //(FEPJDD)^^^^^^^^^^^^^^^ SET SELECTED COUNTRY TO VALUE OF DROP DOWN SELECTION  ^^^^^^^^^^^^^^


  // (DDEL) Drop down event listener: a change in the drop down value will call function filter_endpointJsonDD
  d3.select("#selDataset").on("change",filter_endpointJsonDD)


  ////////// test: checkbox event listener ///////////////////////////////////// CheckBox
  function handleChange(){
    var x = document.getElementById("corr-chkbx");

      if(x.checked == true){
          console.log('GDP/Capita: yes')
          indexSelector_line2 = 3
      }
      else{
          console.log('GDP/Capita: no')
      }
  }

  d3.select("#corr-chkbx").on('change',handleChange)
  ////////// test: checkbox event listener ///////////////////////////////////// CheckBox




  //// TEST///////// connect drop down selection to map: access polygons from using dropdown listiner ///////


  //// TEST///////// connect drop down selection to map: access polygons from using dropdown listiner ///////




    //vvvvvvvvvvvvvvvvvvv BUTTON EVENT LISTENERS & GRAPH CALIBRATION FUNCTIONS vvvvvvvvvvvvvvvvv
    // Called after a button is clicked:
    // sets the indexSelector to the value that corresponds to the data file id
    // calls the filter_endpointjson 
    function life_click(){
      indexSelector_line1 = 4
      indexSelector_line2 = 5
      filter_endpointJson(selected_country)
    };

    function econIndx_click(){
      indexSelector_line1 = 2
      indexSelector_line2 = 3
      filter_endpointJson(selected_country)
    };

    function poliIndx_click(){
        indexSelector_line1 = 8
        indexSelector_line2 = 9
        filter_endpointJson(selected_country)
    };

    function fdiVSgdp_click(){
      scatter_data();
      fdi_vs_metric = 1
    };

    function fdiVShumdev_click(){
      scatter_data();
      fdi_vs_metric = 6
    };

    function fdiVScorr_click(){
      scatter_data();
      fdi_vs_metric = 9
    };

    //button listenetrs 
    d3.select('#lifeIndx-btn').on('click', life_click);
    d3.select('#poliIndx-btn').on('click', poliIndx_click);
    d3.select('#econIndx-btn').on('click', econIndx_click);
    d3.select('#fdi_gdp-btn').on('click', fdiVSgdp_click);
    d3.select('#fdi_humnDev-btn').on('click', fdiVShumdev_click);
    d3.select('#fdi_corr-btn').on('click',fdiVScorr_click);
    //^^^^^^^^^^^^^^^^^^^^^^^^^ BUTTON EVENT LISTENERS & GRAPH CALIBRATION FUNCTIONS ^^^^^^^^^^^^^

    ////define click function TEST/////


    /////define click funciong TEST////
  
    
    // Creating a geoJSON layer with the retrieved data
   
      // Style each feature (in this case a country)
      //Feature is the geoJson data for each polygon representing each country. each feature has properties and a name = country name
    
    // //   style: function(feature) {
    // //         return {
    // //         color: "white",
    // //         fillColor: '#2B7A78',
    // //         fillOpacity: 0.5,
    // //         weight: 1
    // //         };
    // //     },
    //   // Called on each feature mouseover, mouseout & click
    //   onEachFeature: function(feature, layer) {
    //     // Set mouse events to change map styling
    //     country_name = feature.properties.name;

    //     if(not_ssa.indexOf(country_name) === -1){
    //       layer.on({
    //         // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
    //         mouseover: function mouseover_func(event) {
    //           //console.log(event.target)
    //           if (selected_country != feature.properties.name ){
    //             layer = event.target;
    //             layer.setStyle({
    //               fillColor: '#3AAFA9',
    //               fillOpacity: 0.9
    //             });
    //           }
    //         },
    //         // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
    //         mouseout: function mouseout_func(event) {    
    //           //console.log(event.target)     
    //           ////// TESTING: if country is clicked then mouseout funtion should not work ///////////
    //           if (selected_country != feature.properties.name ){
    //             layer = event.target;
    //             layer.setStyle({
    //               fillColor: '#2B7A78',
    //               fillOpacity: 0.5
    //             });              
    //           }
    //         },
    //         // (MEL) Map listener: when a country is selected from the map this is activiated.            
    //         click: function click_func(event) {
    //             console.log(event.target)  
               

    //           selected_country = feature.properties.name
    //           d3.select('#selDataset').node().value = selected_country 
    //           filter_endpointJsonDD()
                                         
    //           layer = event.target;

    //           layer.setStyle({
    //             fillColor: 'gold',
    //             fillOpacity: 0.5
    //           });    

    //           if(clickflag == 0){
    //             old_layer = layer
    //             clickflag ++
    //           }
              
    //           if(old_layer != layer){
    //             old_layer.setStyle({
    //               fillColor: '#2B7A78',
    //               fillOpacity: 0.5
    //             });  

    //             old_layer = layer
    //           }   
         
    //         }     

    //       });
    //     }
    
    //     }
    //   }

d3.json(geoData).then(function(d){
d3.select('#selDataset').on('change.carly', function(){
  country = d3.select('#selDataset').node().value
  poly = d.features.filter(a => a.properties.name == country)
  if(outline){
    myMap.removeLayer(outline)
    };
    outline = L.geoJSON(poly[0].geometry, {
      color: "black",
      weight: 5,
      opacity: 2,
      interactive: false,
      fillOpacity: 0
    }).addTo(myMap)

})

})



 