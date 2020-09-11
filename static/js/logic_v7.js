// Process flow scenarios legend:
//    1) initial page load: 
//    2) click on country from drop down > DDEL > FEPJDD > FEPJ > BG & BSS > country graph & ticker displayed on page
//    3) click on country from map        > MEL > FEPJDD > FEPJ > BG & BSS > country graph & ticker displayed on page
//    4) click on country graph buttons:
//    5) click on SSA scatter graph buttons:

var endpoint = '/ultimate'
var scatter_marker = document.getElementById('one')


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
  var makeOutline = function(){};

  var scatter_array = [] // array will contain the above objects. will be used to build the scatter graph
  
var selected_country = 'All African Countries'

var conflict_radio_button_flag = 1
var gdp_radio_button_flag = 0
var diversity_radio_button_flag = 0
var corr_radio_button_flag = 0

var selected_country_endpointData

// used to build scatter
var scatter_label_country_names = []
var scatter_xAxis_conflict_events = []
var scatter_yAxis_gdp_total = [] 
var scatter_yAxis_conflict_fatalities = []
var scatter_yAxis_corruption_control_percentile = []
var scatter_yAxis_total_population = []

// Used to build graph
title_country_name = []
var xAxis_year = []
//Conflict
var yAxis_conflict_events = []
var yAxis_conflict_fatalities =[]
//Economic 
var yAxis_fdi_inflows_total= []
var yAxis_gdp_total = []
var yAxis_gdp_per = []
var yAxis_gni_total = []
var yAxis_fdi_gdp_per = []
//Social
var yAxis_total_population = []
var yAxis_urban_population = []
var yAxis_rural_population= []
var yAxis_total_population_growth = []
var yAxis_rural_population_growth = []
var yAxis_urban_population_growth = []
var yAxis_ethnic_score = []
//political
var yAxis_corruption_control_percentile = []
var yAxis_government_effectiveness_percentile = []
var yAxis_ruleoflaw_percentile = []

// vvvvvvvvvvvvvvvvvvvvvvvvvvv Country news ticker generator vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function createNews(country){
  var panel = d3.select('#sample-metadata');
  var noTick = 
  d3.json(`/api/data/getticker/${country}`).then(function(news){
    var ticker = '';
    panel.html("");
    var marquee = panel.append('marquee');
    if (d3.select('#selDataset').node().value == 'All African Countries') {
    console.log("HELLO")}
    else{for (i = 0; i < 5; i++){
      var dateNews = marquee.append('span').text(`${news['Date'][i]} | `)
      var tick = marquee.append('a').attr('href',`${news['Link'][i]}`).text(`${news['Title'][i]} || `).attr('target',"_blank")                           
        }}               
   } 
);   
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^ Country news ticker generator ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


// vvvvvvvvvvvvvvvvvvvvvvvvvv Build Scatter vvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function buildScatter(){
  
  var conflict_trace = {
    x: scatter_xAxis_conflict_events,
    y: scatter_yAxis_conflict_fatalities,
    mode: 'markers',
    type: 'scatter',
    name: 'Country',
    text: scatter_label_country_names,
    marker: { size: 12, color:'indianred',
    opacity: 0.75,
    line: {color: '#8b0f2a',
    width: 3.5,
    } }
  };

  var ethnic_trace = {
    x: scatter_xAxis_conflict_events,
    y: scatter_yAxis_total_population,
    mode: 'markers',
    type: 'scatter',
    name: 'Country',
    text: scatter_label_country_names,
    marker: { size: 12, color:'goldenrod',
    line: {color: '#DC4405',
    width: 3.5,
    }}
  };

  var gdp_trace = {
    x: scatter_xAxis_conflict_events,
    y: scatter_yAxis_gdp_total,
    mode: 'markers',
    type: 'scatter',
    name: 'Country',
    text: scatter_label_country_names,
    marker: { size: 12, color:'#2B7A78',
    opacity:0.85,
    line: {color: 'palegreen',
    width: 3.5} }
  };

  var corr_trace = {
    x: scatter_xAxis_conflict_events,
    y: scatter_yAxis_corruption_control_percentile,
    mode: 'markers',
    type: 'scatter',
    name: 'Country',
    text: scatter_label_country_names,
    marker: { size: 12, color:'#000080',
    opacity:0.85,
    line: {color: '#4B9CD3',
    width: 3.5} }
  };
  
    
  if(gdp_radio_button_flag == 1){
    data = [gdp_trace]
    layout = {
      title:'African GPD vs. Conflict',
      "titlefont": {
        "color": 'white'
      },
      xaxis: {title: "Country Conflict Events",
      color: 'white'},
      yaxis: {title: "Country Total GDP",
      color: 'white'},
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      // showlegend: true,
      // legend: {"orientation": "h"} 
    };
    // gdp_radio_button_flag = 0
  }

  else if(diversity_radio_button_flag == 1){
    data = [ethnic_trace]
    layout = {
      title:'African Population vs. Conflict',
      "titlefont": {
        "color": 'white'
      },
      xaxis: {title: "Country Conflict Events",
      color: 'white'},
      yaxis: {title: "Country Total Population",
      color: 'white'},
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      // showlegend: true,
      // legend: {"orientation" : "h"}
    };
    // diversity_radio_button_flag = 0
  }  

  else if(corr_radio_button_flag == 1){
    data = [corr_trace]
    layout = {
      title:'African Corruption vs. Conflict',
      "titlefont": {
        "color": 'white'
      },
      xaxis: {title: "Country Conflict Events",
      color: 'white'},
      yaxis: {title: "Country Corruption Control %",
      color: 'white'},
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      // showlegend: true,
      // legend: {"orientation" : "h"}
    };
    // corr_radio_button_flag = 0
  }

  else if(conflict_radio_button_flag == 1){
    data = [conflict_trace]
    layout = {
      title:'Continent Conflict Comparison',
      "titlefont": {
        "color": 'white'
      },
      xaxis: {title: "Country Conflict Events",
      color: 'white'},
      yaxis: {title: "Country Fatalities",
      color: 'white'},
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      // showlegend: true,
      // legend: {"orientation" : "h" },
    };
    // conflict_radio_button_flag = 0
  }
  
  // var layout = {
  //   title:'Continent Conflict Comparison'
  // };
  
  Plotly.react('one', data, layout);
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^ Build Scatter ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// vvvvvvvvvvvvvvvvvvvvvvvvvv Build Graphs vvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function buildGraph(){
  

  
  
  var conflict_events_trace = {
    x: xAxis_year,
    y: yAxis_conflict_events,
    name: `Conflict Events`,
    type: 'bar',
    marker: {color: 'indianred',
    opacity: 0.65,
    line: {color: '#8b0f2a',
    width: 3.5,
    }
    },
  }


  var conflict_fatalities_trace = {
    x: xAxis_year,
    y: yAxis_conflict_fatalities,
    name: `Conflict Fatalities`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'white',
    width: 5
    },
    connectgaps: true
  }

  var fdi_inflows_total_trace = {
    x: xAxis_year,
    y: yAxis_fdi_inflows_total,
    name: `FDI inflows`,
    yaxis: 'y1',
    type: 'line',
    line: {color: 'green'
    },
    connectgaps: true
  }

  var fdi_inflows_gdp_trace = {
    x: xAxis_year,
    y: yAxis_fdi_gdp_per,
    name: `FDI as a Percentage of GDP`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'goldenrod',
    width: 5
    },
    connectgaps: true
  }

  var gdp_per_trace = {
    x: xAxis_year,
    y: yAxis_gdp_per,
    name: `GDP Growth %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: '#4c7838',
    width: 5
    },
    connectgaps: true
  }

  var gni_total = {
    x: xAxis_year,
    y: yAxis_gni_total,
    name: `GNI Total`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'red'
    },
    connectgaps: true
  }

  var total_population_trace = {
    x: xAxis_year,
    y: yAxis_total_population,
    name: `Total Population`,
    yaxis: 'y2',
    mode: 'lines+markers',
    line: {color: 'yellow'
    },
    connectgaps: true
  }

  var urban_population_trace = {
    x: xAxis_year,
    y: yAxis_urban_population,
    name: `Urban Population`,
    yaxis: 'y1',
    type: 'bar',
    marker: {color: 'goldenrod',
    opacity: 0.8,
 
    }
  }

  var rural_population_trace = {
    x: xAxis_year,
    y: yAxis_rural_population,
    name: `Rural Population`,
    yaxis: 'y1',
    type: 'bar',
    marker: {color: '#DA70D6',
    opacity: 0.65,

    }
    
  }
  var conflict_events_line_trace = {
    x: xAxis_year,
    y: yAxis_conflict_events,
    name: `Conflict Events`,
    type: 'line',
    yaxis: 'y2',
    line: {color: 'white',
    width: 5
    },
    connectgaps: true
  }


  //
  var total_population_growth_trace = {
    x: xAxis_year,
    y: yAxis_total_population_growth,
    name: `Total Population Growth %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'goldenrod'
    },
    connectgaps: true
  }

  var urban_population_growth_trace = {
    x: xAxis_year,
    y: yAxis_urban_population_growth,
    name: `Urban Population Growth %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: '2B7A78'
    },
    connectgaps: true
  }

  var rural_population_growth_trace = {
    x: xAxis_year,
    y: yAxis_rural_population_growth,
    name: `Rural Population Growth %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: '#000080'
    },
    connectgaps: true
  }


  var ethnic_score_trace = {
    x: xAxis_year,
    y: yAxis_ethnic_score,
    name: `Ethnic Score`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'goldenrod'
    },
    connectgaps: true
  }
//
  var corruption_control_percentile_trace = {
    x: xAxis_year,
    y: yAxis_corruption_control_percentile,
    name: `Corruption Control  %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: '#56A0D3',
    width: 5
    },
    connectgaps: true
  }

  var government_effectiveness_percentile_trace = {
    x: xAxis_year,
    y: yAxis_government_effectiveness_percentile,
    name: `Government Eff. %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'white',
    width: 5
    },
    connectgaps: true
  }

  var ruleoflaw_percentile_trace = {
    x: xAxis_year,
    y: yAxis_ruleoflaw_percentile,
    name: `Rule of Law %`,
    yaxis: 'y2',
    type: 'line',
    line: {color: 'goldenrod',
    width: 5
    },
    connectgaps: true
  }

  if(gdp_radio_button_flag == 1){
    data = [conflict_events_trace, gdp_per_trace, fdi_inflows_gdp_trace];
    layout = {
      title:  `${title_country_name[0]} GDP Graph`,
      "titlefont": {
        "color": 'white'
      },
      xaxis: {
        color: 'white'},
      yaxis: {title: 'Conflict Events',
      showgrid: false,
      color: 'white',
      font: {color: 'white'}},
      color:'black',
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      yaxis2: {
        title: 'GDP Growth % / FDI % of GDP',
        showgrid: false,
        color: 'white',
        overlaying: 'y',
        side: 'right'
      },
      showlegend: true,
        legend: {"orientation": "h",
        color: 'white',
        font:{
          color: 'white'
        }},
   
      connectgaps: true

    }
    // gdp_radio_button_flag = 0
  }

  else if(diversity_radio_button_flag == 1){
    data = [conflict_events_line_trace, rural_population_trace, urban_population_trace];
    layout = {
      barmode: 'stack',
      title:  `${title_country_name[0]} Demographics Graph`,
      "titlefont": {
        "color": 'white',
      },
      xaxis: {
        color: 'white'},
      yaxis: {title: 'Urban v. Rural Population %',
      showgrid: false,
      color: 'white',
      font: {color: 'white'}},
      color:'black',
      // overlaying: 'y',
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      yaxis2: {
        title: 'Conflict Events',
        showgrid: false,
        color: 'white',
        overlaying: 'y',
        side: 'right'
      },
      showlegend: true,
        legend: {"orientation": "h",
        color: 'white',
        font:{
          color: 'white'
        }},
      connectgaps: true

    }
    // diversity_radio_button_flag = 0
  }  

  else if(corr_radio_button_flag == 1){
    data = [conflict_events_trace,corruption_control_percentile_trace, government_effectiveness_percentile_trace, ruleoflaw_percentile_trace];
    layout = {
      title:  `${title_country_name[0]} Corruption Graph`,
      "titlefont": {
        "color": 'white'
      },
      xaxis: {
        color: 'white'},
      yaxis: {title: 'Corruption Score',
      color: 'white',
      showgrid: false},
      color:'black',
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      yaxis2: {
        title: 'Rule of Law',
        color: 'white',
        overlaying: 'y',
        side: 'right',
        showgrid: false
      },
      showlegend: true,
        legend: {"orientation": "h",
        color: 'white',
        font:{
          color: 'white'
        }
      },
      connectgaps: true

    }
    // corr_radio_button_flag = 0
  }

  else if(conflict_radio_button_flag == 1){
    data = [conflict_events_trace,conflict_fatalities_trace];
    layout = {
      title:  `${title_country_name[0]} Conflict Graph`,
      "titlefont": {
        "color": 'white'
      },
      yaxis: {title: 'Conflict Events',
      color: 'white',
      showgrid: false},
      xaxis: {
      color: 'white'},
      color:'black',
      paper_bgcolor: '#191a1a',
      plot_bgcolor: '#191a1a',
      yaxis2: {
        title: 'Fatalites',
        color: 'white',
        showgrid: false,
        overlaying: 'y',
        side: 'right'
      },
      showlegend: true,
        legend: {"orientation": "h",
        margin: {
          r: 10, //increase right margin
          pad: 10
          },
        color: 'white',
      font:{
        color: 'white'
      }},
      connectgaps: true

    }
    // conflict_radio_button_flag = 0
  }

  // var layout = {
  //   title: `${title_country_name[0]} Conflict Graph`,
  //   yaxis: {title: 'first graph'},
  //   color:'black',
  //   yaxis2: {
  //     title: 'first graph',
  //     overlaying: 'y',
  //     side: 'right'
  //   },
  //   showlegend: true,
  //     legend: {"orientation": "h"},
  //   connectgaps: true
  // };
  var config2 = {responsive : true}
  Plotly.react ("one", data, layout, config2)

  // document.getElementById("#one").classList.remove('Legend')
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Build Graphs ^^^^^^^^^^^^^^^^^^^^^^^^

function clearAxisArrays(){
  // used to build scatter
  scatter_label_country_names = []
  scatter_xAxis_conflict_events = []
  scatter_yAxis_gdp_total = [] 
  scatter_yAxis_conflict_fatalities = []
  scatter_yAxis_corruption_control_percentile = []
  scatter_yAxis_total_population = []

  // Used to build graph
  xAxis_year = []
  title_country_name = []
  //Conflic
  yAxis_conflict_events = []
  yAxis_conflict_fatalities =[]
  //Economic 
  yAxis_fdi_inflows_total= []
  yAxis_gdp_total = []
  yAxis_gdp_per = []
  yAxis_gni_total = []
  yAxis_fdi_gdp_per = []
  //Social
  yAxis_total_population = []
  yAxis_urban_population = []
  yAxis_rural_population= []
  yAxis_total_population_growth = []
  yAxis_rural_population_growth = []
  yAxis_urban_population_growth = []
  yAxis_ethnic_score = []
  //political
  yAxis_corruption_control_percentile = []
  yAxis_government_effectiveness_percentile = []
  yAxis_ruleoflaw_percentile = []
}


// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Retrive data from Endpoint and filter using selected country vvvvvvvvvvvvvv     
function getSelectedCountryDataFromEndpoint(){
  clearAxisArrays()
  if(selected_country != 'All African Countries'){
    d3.json(endpoint).then(endpointData => {
      selected_country_endpointData = endpointData.filter(epd => epd.country_name == selected_country )
      selected_country_endpointData = selected_country_endpointData.sort((a,b)=> a.year - b.year)
      console.log(selected_country_endpointData)
  
      selected_country_endpointData.forEach(sced => { 
        title_country_name.push(sced.country_name)   
        xAxis_year.push(sced.year)
        yAxis_conflict_events.push(sced.conflict_events)
        yAxis_conflict_fatalities.push(sced.conflict_fatalities)
        yAxis_fdi_inflows_total.push(sced.fdi_inflows_total)
        yAxis_gdp_per.push(sced.gdp_growth_per)
        yAxis_fdi_gdp_per.push(sced.fdi_inflows_gdp)
        yAxis_gdp_total.push(sced.gdp_total)
        yAxis_gni_total.push(sced.gni_total)
        yAxis_total_population.push(sced.total_population)
        yAxis_urban_population.push(sced.urban_population)
        yAxis_rural_population.push(sced.rural_population)
        yAxis_total_population_growth.push(sced.population_growth_annual_per)
        yAxis_rural_population_growth.push(sced.rural_population_growth)
        yAxis_urban_population_growth.push(sced.urban_population_growth)
        yAxis_ethnic_score.push(sced.ethnic_score) 


        yAxis_corruption_control_percentile.push(sced.corruption_control_percentile)
        yAxis_government_effectiveness_percentile.push(sced.government_effectiveness_percentile)
        yAxis_ruleoflaw_percentile.push(sced.ruleoflaw_percentile)
      })
      buildGraph()

    

      document.getElementsByClassName("legend")[0].classList.remove("legend")




    })
  }

  else if(selected_country == 'All African Countries'){
    d3.json(endpoint).then(endpointData => {
      // array.slice(-1)[0] grabs the last item in the array 
      var all_countires = endpointData.filter(epd => epd.year == endpointData.slice(-1)[0]['year'])
        all_countires.forEach(cac => {
        scatter_label_country_names.push(cac.country_name)
        scatter_xAxis_conflict_events.push(cac.conflict_events)
        scatter_yAxis_conflict_fatalities.push(cac.conflict_fatalities)
        scatter_yAxis_corruption_control_percentile.push(cac.corruption_control_percentile)
        scatter_yAxis_gdp_total.push(cac.gdp_total)
        scatter_yAxis_total_population.push(cac.total_population)
      })
     buildScatter()

    //  //vvvvvvvvvvvvvvvvvvvvvvvvvv CLICKING ON SCATTER GRAPH MARKER TO GENERATE COUNTRY GRAPH vvvvvvvvvvvvvvvvvvvvvv
     scatter_marker.on('plotly_click', function click_scatter_marker(data){
      selected_country = data.points[0].text
      d3.select('#selDataset').node().value = selected_country
      getSelectedCountryDataFromEndpoint()
      createNews(selected_country)
      makeOutline(selected_country)
    }); 
  // ^^^^^^^^^^^^^^^^^^^^^^^^^ CLICKING ON SCATTER GRAPH MARKER TO GENERATE COUNTRY GRAPH ^^^^^^^^^^^^^^^^^^
    
    })
  }
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Retrive data from Endpoint and filter using selected country ^^^^^^^^^^^^^^^^^
getSelectedCountryDataFromEndpoint()

function setSelectedCountryValue(){ 
  selected_country = d3.select('#selDataset').node().value
  getSelectedCountryDataFromEndpoint()
}
d3.select('#selDataset').on('change',setSelectedCountryValue)

 
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

 makeOutline = function(country_name){
  poly = data.features.filter(a => a.properties.name == country_name)
                    if(outline){
                      myMap.removeLayer(outline)
                      };
                      outline = L.geoJSON(poly[0].geometry, {
                        color: "black",
                        weight: 5,
                        opacity: 2,
                        fillOpacity: 0
                      }).addTo(myMap)
}

function mouseout_func(event) {      
  layer = event.target;
  layer.setStyle({
  color: 'black',
  weight: 1
  });
}
  // Using the dropdown menu to outline the country

  d3.select('#selDataset').on('change.carly', function(){
    country = d3.select('#selDataset').node().value
    createNews(country)
    if(country == 'All African Countries'){
      myMap.removeLayer(outline)
      console.log("All African Countries Selected")
    }
    else{
    poly = data.features.filter(a => a.properties.name == country)
    if(outline){
    myMap.removeLayer(outline)
    };
    outline = L.geoJSON(poly[0].geometry, {
      color: "black",
      weight: 5,
      opacity: 2,
      fillOpacity: 0
    }).addTo(myMap)
  }
    


   })

    // Create a new choropleth layer
    ethnicity = L.choropleth(data, {
        onEachFeature: function(feature, layer) {
            // Set mouse events to change map styling
            country_name = feature.properties.name;
          
            layer.on({ 
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });

                        chosenLayer = layer

                          
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: mouseout_func,
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    country_name = event.target.feature.properties.name
                    createNews(country_name)
                    selected_country = feature.properties.name
                    d3.select('#selDataset').node().value = selected_country 
                    makeOutline(country_name)
                    setSelectedCountryValue()

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

            layer.on({ 
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                        chosenLayer = layer
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: mouseout_func,    

                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    selected_country = feature.properties.name
                    country_name = event.target.feature.properties.name
                    createNews(country_name)
                    d3.select('#selDataset').node().value = selected_country 
                    makeOutline(country_name)
                    setSelectedCountryValue()
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

            layer.on({ 
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        chosenLayer = event.target
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: mouseout_func,
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {
                    selected_country = feature.properties.name
                    country_name = event.target.feature.properties.name
                    createNews(country_name)
                    d3.select('#selDataset').node().value = selected_country 
                    makeOutline(country_name)
                    setSelectedCountryValue()            
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

            layer.on({ 
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function mouseover_func(event) {
                    if (selected_country != feature.properties.name ){
                        layer = event.target;
                        layer.setStyle({
                        color: 'black',
                        weight: 5
                        });
                        chosenLayer = layer
                    }
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout:mouseout_func,
                // (MEL) Map listener: when a country is selected from the map this is activiated.            
                click: function click_func(event) {   
                    selected_country = feature.properties.name
                    country_name = event.target.feature.properties.name
                    createNews(country_name)
                    d3.select('#selDataset').node().value = selected_country 
                    makeOutline(country_name)
                    setSelectedCountryValue()
                },    

            });
        },
        // Define what  property in the features to use
        valueProperty: "Corruption_2018",
    
        // Set color scale
        scale: ["#ffffff", "#003EFF"],
    
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
          "Instances of Conflict": conflict,
          "Ethnicity Score": ethnicity,
          "GDP Growth Rate": gdpGrowth,    
          "Corruption Score": corruption
        }
      
        var myMap = L.map("map", {
          center: [-1.170320, 23.241192],
          zoom: 3,
          layers: conflict
        });
            legendMort.addTo(myMap);


            ////////// Trying to merge in Yasir's Code ///////////////////
            // scatter_marker.on('plotly_click', function click_scatter_marker(data){
            //   selected_country = data.points[0].text
            //   d3.select('#selDataset').node().value = selected_country
            //   getSelectedCountryDataFromEndpoint()
            //   createNews(selected_country)
            //   makeOutline(selected_country)
            // }); 
            

          L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/dark-v10",
            scrollWheelZoom: false,
            accessToken: 'sk.eyJ1IjoiY2FybHlma2VsbHkiLCJhIjoiY2tkZ3U4Z3B3Mmx6dDJ4cG16Y2l6eWQ1bCJ9.ewwhVCi9nw45LL2iNZ1hbA'
          }).addTo(myMap);

            L.control.layers(baseMaps, null, {collapsed:false}).addTo(myMap);

            myMap.scrollWheelZoom.disable();

         myMap.on('baselayerchange',function(eventlayer){
          this.removeControl(legend)
          this.removeControl(legendMort)
          this.removeControl(legendCase)
          this.removeControl(legendCorupt)

          if(outline){
            myMap.removeLayer(outline)
            outline.addTo(myMap)
            }
           
          if(eventlayer.name == 'GDP Growth Rate'){
            gdp_radio_button_flag = 1
            diversity_radio_button_flag = 0
            conflict_radio_button_flag = 0
            corr_radio_button_flag = 0
            legendCase.addTo(myMap)
            if(d3.select('#selDataset').node().value == 'All African Countries' && outline){
              myMap.removeLayer(outline)
            }
            if(selected_country != ''){
              setSelectedCountryValue()            }
          }

          if(eventlayer.name == 'Ethnicity Score'){
            diversity_radio_button_flag = 1
            gdp_radio_button_flag = 0
            conflict_radio_button_flag = 0
            corr_radio_button_flag = 0
            legend.addTo(myMap)
            if(d3.select('#selDataset').node().value == 'All African Countries' && outline){
              myMap.removeLayer(outline)
            }
            if(selected_country != ''){
              setSelectedCountryValue()            }
          }

          if(eventlayer.name == 'Instances of Conflict'){
            gdp_radio_button_flag = 0
            diversity_radio_button_flag = 0
            conflict_radio_button_flag = 1
            corr_radio_button_flag = 0            
            legendMort.addTo(myMap)
            if(d3.select('#selDataset').node().value == 'All African Countries' && outline){
              myMap.removeLayer(outline)
            }
            if(selected_country != ''){
              setSelectedCountryValue()            }
          }

          if(eventlayer.name == 'Corruption Score'){
            gdp_radio_button_flag = 0
            diversity_radio_button_flag = 0
            conflict_radio_button_flag = 0
            corr_radio_button_flag = 1            
            legendCorupt.addTo(myMap)
            if(d3.select('#selDataset').node().value == 'All African Countries' && outline){
              myMap.removeLayer(outline)
            }
            if(selected_country != ''){
              setSelectedCountryValue()            }
          }
        })


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
///////// test: checkbox event listener ///////////////////////////////////// CheckBox
d3.select("#corr-chkbx").on('change',handleChange)

})


// ATTEMPT AT A BUBBLE CHART BELOW!!!! //
Highcharts.chart('container', {
  legend: {itemStyle: {
    color: 'white'}},
  chart: {
      type: 'packedbubble',
      backgroundColor: '#191a1a',
      height: '50%'
  },
  title: {
    style: {color: 'whitesmoke'},

      text: 'Feature Importance in Predicting Conflict',
  },
  tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}'
  },
  plotOptions: {
      packedbubble: {
          minSize: '40%',
          maxSize: '200%',
          zMin: 0,
          zMax: 0.4,
          layoutAlgorithm: {
              gravitationalConstant: 0.01,
              splitSeries: false
          },
          dataLabels: {
              enabled: true,
              format: '{point.name}',
              filter: {
                  property: 'y',
                  operator: '>',
                  value: .01
              },
              style: {
                  color: 'white',
                  textOutline: 'none',
                  fontWeight: 'normal'
              }
          }
      }
  },

  series: [{
      name: 'Population Factors',
      data: [{
          name: 'Ethnic Score',
          value: 0.246329
      }, 
      {
          name: "Mortality Rate",
          value: 0.082087
      
      }],
      color: '#CA3433'
  }, {
      name: 'Economic Factors',
      data: [{
          name: "Total GNI",
          value: 0.128995
      },
      {
          name: "GDP Per Capita",
          value: 0.096466
      },
     ],
      color: '#95F985'
  }, {
      name: 'Government Factors',
      data: [{
          name: "Effectiveness",
          value: 0.114408
      },
      {
          name: "Rule of Law",
          value: 0.079391
      },
      {
          name: "Stability",
          value: 0.079769
      },
      {
        name: "Accountability",
        value: 0.100860
    },
    {
      name: "Corruption Control",
      value: 0.072335
    }],
      color: 'goldenrod'

  } 
]
}); 

document.getElementById('dangerLight').onclick = illuminateRed;
document.getElementById('stableLight').onclick = illuminateYellow;
document.getElementById('warningLight').onclick = illuminateOrange;
document.getElementById('peacefulLight').onclick = illuminateGreen;

function illuminateRed() {
  clearLights();
  setTimeout(function () { document.getElementById('dangerLight').style.backgroundColor = "red"; }, 500)
}

function illuminateYellow() {
  clearLights();
  setTimeout(function () { document.getElementById('stableLight').style.backgroundColor = "yellow"; }, 500)
}

function illuminateOrange(){
  clearLights();
  setTimeout(function () { document.getElementById('warningLight').style.backgroundColor = "orange"; }, 500)
}

function illuminateGreen(){
  clearLights();
  setTimeout(function () { document.getElementById('peacefulLight').style.backgroundColor = "green"; }, 500)
}

function clearLights() {
  document.getElementById('dangerLight').style.backgroundColor = "black";
  document.getElementById('stableLight').style.backgroundColor = "black";
  document.getElementById('warningLight').style.backgroundColor = "black";
  document.getElementById('peacefulLight').style.backgroundColor = "black";
}

/***
 * Implementing event lister on Slider button
 */

stopButton = d3.select('#stopButton');
stopButton.on("click", function(foo){

  corruption_score = d3.select('#myRange1').node().value;
  console.log(`Corruption score: ${corruption_score}`)

  stability_score = d3.select('#myRange2').node().value;
  console.log(`Stability score: ${stability_score}`)

  government_effectiveness = d3.select('#myRange3').node().value;
  console.log(`Government effectiveness: ${government_effectiveness}`)

  rule_of_law = d3.select('#myRange4').node().value;
  console.log(`Rule of law: ${rule_of_law}`)

  ethnic_score = d3.select('#myRange5').node().value;
  console.log(`Ethnic score: ${ethnic_score}`)

  gdp_per_capita = d3.select('#myRange6').node().value;
  console.log(`GDP per capita: ${gdp_per_capita}`)

  fdi_inflows_gdp = d3.select('#myRange7').node().value;
  console.log(`FDI inflows as % of GDP: ${fdi_inflows_gdp}`)

  predict_endpoint = `/predict?corruption_score=${corruption_score}&stability_score=${stability_score}&government_effectiveness=${government_effectiveness}&rule_of_law=${rule_of_law}&ethnic_score=${ethnic_score}&gdp_per_capita=${gdp_per_capita}&fdi_inflows_gdp=${fdi_inflows_gdp}` 
  d3.json(predict_endpoint).then(function(data){


    console.log('the endpoint sent back:');
    console.log(data);

    if (data.predicted_class == '[0]'){
      illuminateGreen()
    }
    if (data.predicted_class == '[1]'){
      illuminateYellow()
    }
    if (data.predicted_class == '[2]'){
      illuminateOrange()
    }
    if (data.predicted_class == '[3]'){
      illuminateRed()
    }
    
  });

});