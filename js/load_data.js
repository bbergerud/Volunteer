var states, activities, organizations, demographics;

var projection = d3.geoAlbersUsa();

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.json('/data/us_states.json').then(function(json){
  d3.csv('/data/organizations.csv').then(function(orgs){
    d3.csv('/data/activities.csv').then(function(acts){
      d3.csv('/data/demographics.csv').then(function(demo){

      // Remove Puerto Rico
      json.features.pop();

      // Add the volunteer data to the json file
      json.features.forEach(function(d){

          // Find the index corresponding to the state
          for (var i = 0; i < acts.length; i++) {
              if (d.properties.NAME == acts[i].state) {
                  break;
              }
          }

          // Add the activity and organizations
          d.acts = acts[i];
          d.orgs = orgs[i];
          d.demo = demo[i];
      });

      // Store the data for easy access
      states = json;
      demographics = demo;


      organizations = [];
      activities    = [];
      stateNames    = [];

      for (var row of acts) {
        var temp = [];
        for (var c of acts.columns.slice(1,-1)) {
          temp.push({'axis': c, 'value': row[c]});
        }
        activities.push({'state': row.state, 'data' : temp});
        stateNames.push(row.state);
      }

      setStateRC(stateNames);

      for (var row of orgs) {
        var temp = [];
        for (var c of orgs.columns.slice(1,-1)) {
          temp.push({'axis': c, 'value': row[c]})
        }
        organizations.push({'state': row.state, 'data': temp});
      }

      initUnivariate();
      initRadarChart();
      $('#selectGroupRC').change(function(){
        initRadarChart();
      })
      initBivariate();
      initScatterplot();

      }) // end demo
    }) // end acts
  }) // end orgs
}); // end json
