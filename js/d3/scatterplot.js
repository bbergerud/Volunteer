function getYlabel() {
  var group = getGroup('SP');
  var type  = getType('SP');

  return `Volunteer % (${type})`;
}

function getXlabel() {
  var demo = getDemo('SP');
  return demographic_labels[demo];
}


function initScatterplot() {

  var svg = d3.select('#scatPlot')
    .attr('width', sWidth)
    .attr('height', sHeight);

  var demo = getDemo('SP');
  var group = getGroup('SP');
  var type  = getType('SP');
  var scale = getScale('SP');

  if (scale == 'linear') {
    var xScale = d3.scaleLinear()
    .domain([
      d3.min(states.features, function(d){return +d.demo[demo];}),
      d3.max(states.features, function(d){return +d.demo[demo];})
    ])
    .range([margin.left, sWidth-margin.right]);
  } else {
    var xScale = d3.scaleLog()
      .domain([
        d3.min(states.features, function(d){return +d.demo[demo];}),
        d3.max(states.features, function(d){return +d.demo[demo];})
      ])
      .range([margin.left, sWidth-margin.right]);
  }

  var yScale = d3.scaleLinear()
    .domain([
      100 * d3.min(states.features, function(d){return +d[group][type];}),
      100 * d3.max(states.features, function(d){return +d[group][type];})
    ])
    .range([sHeight-margin.bottom, margin.top]);

  var xAxis = d3.axisBottom()
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .scale(yScale);

  svg.selectAll('circle')
    .data(states.features)
    .enter()
    .append('circle')
      .attr('cx', function(d){return xScale(+d.demo[demo]);})
      .attr('cy', function(d){return yScale(100 * +d[group][type]);})
      .attr('r', 10)
      .attr('opacity', 0.5)
      .attr('fill', 'purple')
    .append('title')
      .text(function(d){return d.properties.NAME;});


    // X-label text
    svg.append("text")
       .attr('class', 'label x')
       .attr("transform", `translate(${(sWidth+margin.left-margin.right)/2},
                            ${sHeight-margin.bottom/3})`
        )
       .style("text-anchor", "middle")
       .text(getXlabel());

     // Y-label text
     svg.append("text")
         .attr('class', 'label y')
         .attr("transform", "rotate(-90)")
         .attr("x", -(sHeight-margin.bottom+margin.top)/2)
         .attr("y", 0)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .text(getYlabel());


    /*
    .on('mouseover', function(d){
      tooltip.style('opacity', .9)
        .html(d.properties.NAME)
        .style("left", (d3.event.pageX) + "px")
        .style("top",  (d3.event.pageY - 28) + "px");
    })
    .on('mouseout', function(d){
        tooltip.style('opacity', 0);
    });
    */

    // d3.mouse(this)[1]

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${sHeight-margin.bottom})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis);


  d3.selectAll('#selectScaleSP, #selectGroupSP, #selectDemographicSP, #selectTypeSP')
    .on('change', function(){
        updateScatterplot();
    });

}


function updateScatterplot(){
  var svg = d3.select('#scatPlot');

  var demo = getDemo('SP');
  var group = getGroup('SP');
  var type  = getType('SP');
  var scale = getScale('SP');

  if (scale == 'linear') {
    var xScale = d3.scaleLinear()
    .domain([
      d3.min(states.features, function(d){return +d.demo[demo];}),
      d3.max(states.features, function(d){return +d.demo[demo];})
    ])
    .range([margin.left, sWidth-margin.right]);
  } else {
    var xScale = d3.scaleLog()
      .domain([
        d3.min(states.features, function(d){return +d.demo[demo];}),
        d3.max(states.features, function(d){return +d.demo[demo];})
      ])
      .range([margin.left, sWidth-margin.right]);
  }

  var yScale = d3.scaleLinear()
    .domain([
      100 * d3.min(states.features, function(d){return +d[group][type];}),
      100 * d3.max(states.features, function(d){return +d[group][type];})
    ])
    .range([sHeight-margin.bottom, margin.top]);

  var xAxis = d3.axisBottom()
    .scale(xScale);

  var yAxis = d3.axisLeft()
    .scale(yScale);

  svg.selectAll('circle')
    .transition()
    .duration(1000)
    .attr('cx', function(d){return xScale(+d.demo[demo]);})
    .attr('cy', function(d){return yScale(100 * +d[group][type]);})
    .attr('fill', 'purple');

  svg.select('.x.axis')
    .transition()
    .duration(1000)
    .call(xAxis);

  svg.select('.y.axis')
    .transition()
    .duration(1000)
    .call(yAxis);

  svg.select('.x.label')
    .text(getXlabel());

  svg.select('.y.label')
    .text(getYlabel());

}
