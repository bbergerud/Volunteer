function initBivariate(){

  var svg = d3.select('#choroplethBV')
    .attr('width', w)
    .attr('height', h);

  var demo  = getDemo('BV');
  var group = getGroup('BV');
  var type  = getType('BV');

  yArray = states.features.map(function(d){return +d[group][type];});
  yQuantile = d3.scaleQuantile()
      .domain(yArray)
      .range(d3.range(n));

  // Chnage to d.demographic[demo]
  xArray = states.features.map(function(d){return +d.demo[demo]})
  xQuantile = d3.scaleQuantile()
      .domain(xArray)
      .range(d3.range(n));

  var colors = getScheme('BV');
  function colorScale(a,b){
      return colors[yQuantile(b) + xQuantile(a) * n];
  }

  path = d3.geoPath()
    .projection(projection.fitSize([w, h], states));

  svg.selectAll('path')
      .data(states.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', function(d){return colorScale(
          +d.demo[demo],
          +d[group][type]
        );
      })
      .on('mouseover', function(d){

          var stateName = d.properties.NAME;
          var demo  = getDemo('BV');
          var group = getGroup('BV');
          var type  = getType('BV');

          if (group == 'acts') {
            var temp = activity_labels;
          }
          else {
            var temp = organization_labels;
          }

          /*
          var html = '<h2>' + stateName + '</h2>' +
                     '<p> ' + demographic_labels[demo] + ': ' + d.demo[demo] + '</p>' +
                     '<p> ' + temp[type] + ': ' + Math.round(100*d[group][type]) + '%</p>';
          */

          var html = '<h2>' + stateName + '</h2>' +
                     '<p> ' + demographic_labels[demo] + ': ' + d.demo[demo] + '</p>' +
                     '<p> ' + type[0].toUpperCase() + type.slice(1) + ': ' + Math.round(100*d[group][type]) + '%</p>';


          tooltip.style('opacity', .9)
            .html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function(d){
          tooltip.style('opacity', 0);
      });

  d3.selectAll('#selectTypeBV, #selectGroupBV, #selectDemographicBV, #selectSchemeBV')
    .on('change', function(){
        updateBivariate();
    });

  addLegend(svg);

}



function updateBivariate() {

    var demo  = $('#selectDemographicBV').children('option:selected').attr('class');
    var group = $('#selectGroupBV').children('option:selected').attr('class');
    var type  = $('#selectTypeBV').children('option:selected').attr('class');

    yArray = states.features.map(function(d){return +d[group][type];});
    yQuantile = d3.scaleQuantile()
        .domain(yArray)
        .range(d3.range(n));

    xArray = states.features.map(function(d){return +d.demo[demo]})
    xQuantile = d3.scaleQuantile()
        .domain(xArray)
        .range(d3.range(n));

    colors = getScheme('BV');
    function colorScale(a,b){
        return colors[yQuantile(b) + xQuantile(a) * n];
    }

    var svg = d3.select('#choroplethBV');

    svg.selectAll('path')
      .data(states.features)
      .attr('fill', function(d){return colorScale(
          +d.demo[demo],
          +d[group][type]
      );});

    addLegend(svg);

  }




function addLegend(svg) {

  d3.select('#bivariateLegend').remove();

  var g = svg.append('g')
    .attr('id', 'bivariateLegend')
    .attr('transform', `translate(${0.75*w}, ${0.1*h}) rotate(-45 ${k * n / 2},${k * n / 2})`);
    //.attr('transform', `translate(${k * n / 2},${k * n / 2})`);//` rotate(-45 ${k * n / 2},${k * n / 2})`)

  g.append('marker')
      .attr('markerHeight', 10)
      .attr('markerWidth', 10)
      .attr('refX', 6)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .attr('id', 'marker')
      .append('path')
        .attr('d', 'M0,0L9,3L0,6Z');

  var colors = getScheme('BV');

  g.selectAll('rect')
      .data(d3.cross(d3.range(n), d3.range(n)))
      .enter()
      .append('rect')
        .attr('x', function(d){return d[0]*k;})
        .attr('y', function(d){return (n - 1 - d[1])*k;})
        .attr('width', k)
        .attr('height', k)
        .attr('fill', function(d){
          return colors[d[0] + 3*d[1]];
        });

  g.append('line')
    .attr('marker-end', 'url(#marker)')
    .attr('x1', 0)
    .attr('x2', n*k)
    .attr('y1', n*k)
    .attr('y2', n*k)
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5);

  g.append('line')
    .attr('marker-end', 'url(#marker)')
    .attr('y2', 0)
    .attr('y1', n*k)
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5);

  g.append('text')
    .text(getDemo('BV'))
    .attr('font-weight', 'bold')
    .attr('dy', '0.71em')
    .attr('transform', `rotate(90) translate(${0}, 6)`)
    //.attr('transform', `rotate(90) translate(${n/2 * k}, 6)`)
    .attr('text-anchor', 'left');

  g.append('text')
    .text(getType('BV'))
    .attr('font-weight', 'bold')
    .attr('dy', '0.71em')
    //.attr('transform', `translate(${n/2*k}, ${n*k+6})`)
    .attr('transform', `translate(${0}, ${n*k+6})`)
    .attr('text-anchor', 'right');
}
