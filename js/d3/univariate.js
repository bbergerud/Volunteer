function initUnivariate() {

  // Determine what volunteer type is selected
  var group = $('#selectGroupUV').children('option:selected').attr('class');
  var type = $('#selectTypeUV').children('option:selected').attr('class');


  var colorScale = d3.scaleQuantize()
      .domain([
          d3.min(states.features, function(d){return d[group][type];}),
          d3.max(states.features, function(d){return d[group][type];})
      ])
      .range(d3.schemeBlues[7]);

  // Create the map
  var path = d3.geoPath().projection(projection.fitSize([w, h], states));

  // Select SVG element; set width and height
  var svg = d3.select('#choroplethUV')
    .attr('width', w)
    .attr('height', h);


  svg.selectAll('path')
    .data(states.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', function(d){return colorScale(+d[group][type]);})
    .on('mouseover', function(d){

        // Get the volunteer type
        var name = d.properties.NAME;
        var group = $('#selectGroupUV').children('option:selected').attr('class');
        var type = $('#selectTypeUV').children('option:selected').attr('class');
        var html = '<p>' + name + ' = ' + Math.round(100 * d[group][type]) + '%</p>';
        tooltip.style('opacity', .9)
          .html(html)
          .style("left", (d3.event.pageX) + "px")
          .style("top",  (d3.event.pageY) + "px");
    })
    .on('mouseout', function(d){
        tooltip.style('opacity', 0);
    });

  d3.selectAll('#selectTypeUV, #selectGroupUV')
    .on('change', function(){
        console.log('here');
        updateUnivariate();
    });
}


function updateUnivariate() {

    // Determine what volunteer type is selected
    var group = $('#selectGroupUV').children('option:selected').attr('class');
    var type = $('#selectTypeUV').children('option:selected').attr('class');

    // Set the color scale
    var colorScale = d3.scaleQuantize()
        .domain([
            d3.min(states.features, function(d){return d[group][type];}),
            d3.max(states.features, function(d){return d[group][type];})
        ])
        .range(d3.schemeBlues[7]);

    var svg = d3.select('#choroplethUV');

    // Update the map
    svg.selectAll('path')
      .data(states.features)
      .attr('fill', function(d){return colorScale(+d[group][type]);});
}
