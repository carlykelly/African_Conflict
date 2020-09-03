//link to example with code: https://plotly.com/javascript/map-animations/



// CHANGE TO USING ENDPOINT FROM APP.PY Example:
//var nyt_covid_county="/nyt_covid_county_latest";
// d3.json(nyt_covid_county).then((data)=>{


//calling in the data
Plotly.d3.csv("../static/Conflict.csv", function (err, rows) {function filter_and_unpack(rows, key, year) {
        return rows.filter(row => row['year'] == year).map(row => row[key])
    }


    var frames = []
    var slider_steps = []
    //n is the number of years we'll have in our data
    var n = 10;
    // num is the first year in the dataset; enter as an integer, no quotes needed
    var num = 1998;
   //num = new Date(num) 
   // date = formatDate(num)

    for (var i = 0; i <= n; i++) {
        //replace 'cases_percapita' with the unit of analysis (e.g. number of conflicts)// changed date to num
        var z = filter_and_unpack(rows, 'conflict_events', num)
        //in our data, 'postal code' was the state fips; ADD NAME OF COLUMN HEADER
        var locations = filter_and_unpack(rows, 'country_name', num)
        frames[i] = { data: [{ z: z, locations: locations, text: locations }], name: num }
        slider_steps.push({
            label: num.toString(),
            method: "animate",
            args: [[num], {
                mode: "immediate",
                //we can play with these to get the right amount of time the map will stay on each frame
                transition: { duration: 300 },
                frame: { duration: 300 }
            }
            ]
        })

        //this was in the original code; adapted to have every other year
        num = num + 2
        //num = addDays(num, 7);
        //console.log(num)

        //date = formatDate(num)
    }

    var data = [{
        //this will stay the same, right?
        type: 'choropleth',
        //need to check the plotly documentation to see the "locationmode" for African countries -- documentation says "country names" may want to test 'ISO-3'
        locationmode: 'country names',
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        text: frames[0].data[0].locations,
        zauto: false,
        zmin: 0,
        zmax: 2800

    }];
    var layout = {
        //update the title on the map
        title: 'Instances of Conflict over 1998-2018',
        geo: {
            //We can test the scope as "Africa," but the documentation will help us -- documentation says "africa"
            scope: 'africa',
            //I tried every which way to change the color but was unsucessful. It's worth trying again.
            countrycolor: 'rgb(255, 255, 255)',
            showland: true,
            landcolor: 'rgb(85, 214, 170)',
            showlakes: true,
            lakecolor: 'rgb(255, 255, 255)',
            subunitcolor: 'rgb(255, 255, 255)',
            lonaxis: {},
            lataxis: {}
        },
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: { "t": 87, "r": 10 },
            buttons: [{
                method: "animate",
                args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 200,
                    },
                    frame: {
                        duration: 500
                    }
                }],
                label: "Play"
            }, {
                method: "animate",
                args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                            duration: 0
                        },
                        frame: {
                            duration: 0
                        }
                    }
                ],
                label: "Pause"
            }]
        }],
        sliders: [{
            active: 0,
            steps: slider_steps,
            x: 0.1,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: { t: 50, b: 10 },
            currentvalue: {
                visible: true,
                //updated "Date" to "Year"
                prefix: "Year:",
                xanchor: "right",
                font: {
                    size: 20,
                    color: "#55d6aa"
                }
            },
            transition: {
                duration: 300,
                easing: "cubic-in-out"
            }
        }]
    };
//I think 'map' below is the html div
    Plotly.newPlot('animated_map', data, layout).then(function () {
        Plotly.addFrames('animated_map', frames);
    });
})