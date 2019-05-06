const colorNumber = 7;
const wleg = w / colorNumber;

function initUnivariate() {

  // Determine what volunteer type is selected
  var group = $('#selectGroupUV').children('option:selected').attr('class');
  var type = $('#selectTypeUV').children('option:selected').attr('class');


  var colorScale = d3.scaleQuantize()
      .domain([
          d3.min(states.features, function(d){return d[group][type];}),
          d3.max(states.features, function(d){return d[group][type];})
      ])
      .range(d3.schemeBlues[colorNumber]);

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


    var legend = svg.selectAll('g.legendUV')
      .data(colorScale.range())
      .enter()
      .append('g')
      .attr('class', 'legendUV');

    legend.append('rect')
        .attr("x", function(d,i) {
          return i * wleg
        })
        .attr("y", 0)
        .attr("width", wleg)
        .attr("height", 10)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function(d){return d;});

    legend.append('text')
        .attr("x", function(d,i){
          return i*wleg
        }) //leave 5 pixel space after the <rect>
        .attr("y", 15)
        .attr("dy", "0.8em") //place text one line *below* the x,y point
        .text(function(d,i) {
            var extent = colorScale.invertExtent(d);
            //extent will be a two-element array, format it however you want:
            var format = d3.format("0.3f");
            return format(+extent[0]);
        });

  d3.selectAll('#selectTypeUV, #selectGroupUV')
    .on('change', function(){
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
        .range(d3.schemeBlues[colorNumber]);

    var svg = d3.select('#choroplethUV');

    // Update the map
    svg.selectAll('path')
      .data(states.features)
      .attr('fill', function(d){return colorScale(+d[group][type]);});


    var legend = svg.selectAll('g.legendUV')
      .data(colorScale.range());

    legend.selectAll('text')
      .text(function(d,i) {
          var extent = colorScale.invertExtent(d);
          //extent will be a two-element array, format it however you want:
          var format = d3.format("0.3f");
          return format(+extent[0]);
          return format(+extent[0]) + " - " + format(+extent[1]);
      });

}
