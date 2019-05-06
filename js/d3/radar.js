function getStroke() {
  return $('#background').val();
}

function getHighlight() {
  return $('#highlight').val();
}

function initRadarChart(options) {

  var id = '#radarChart';
  var group = $('#selectGroupRC').children('option:selected').attr('class');

  if (group == 'acts') {
    var data = activities;
  } else {
    var data = organizations;
  }

  const size = $('.radarChart').width()
  const dim = parseInt(0.6 * size);
  const m = parseInt(0.20 * size);
  var cfg = {
    w: dim,     //Width of the circle
    h: dim,     //Height of the circle
    margin: {top: m, right: m, bottom: m, left: m}, //The margins of the SVG
    levels: 5,          //How many levels or inner circles should there be drawn
    maxValue: 0,        //What is the value that the biggest circle will represent
    labelFactor: 1.25,  //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60,      //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.025,  //The opacity of the area of the blob
    dotRadius: 4,       //The size of the colored circles of each blog
    opacityCircles: 0.1,    //The opacity of the circles of each blob
    strokeWidth: 2,         //The width of the stroke around each blob
    roundStrokes: false,    //If true the area and stroke will follow a round path
    color: d3.scaleOrdinal(d3.schemeCategory10),        //Color function
    stroke: 'dodgerblue',
    strokeshow: 'darkorange'
  };

  /*
  if('undefined' !== typeof options){
    for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
    }//for i
  }//if
  */

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d){
    return d3.max(d.data.map(function(o){return o.value;}))
  }));

  var allAxis = (data[0].data.map(function(i, j){return i.axis})),    //Names of each axis
    total = allAxis.length,               //The number of different axes
    radius = Math.min(cfg.w/2, cfg.h/2),  //Radius of the outermost circle
    Format = d3.format('.1%'),              //Percentage formatting
    angleSlice = Math.PI * 2 / total;     //The width in radians of each "slice"

  //Scale for the radius
  var rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);


  var svg = d3.select(id)
    .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("class", "radar"+id);

  svg.selectAll('*').remove();

  //Append a g element
  var g = svg.append("g")
    .attr("transform", "translate(" +
      (cfg.w/2 + cfg.margin.left) + "," +
      (cfg.h/2 + cfg.margin.top) + ")"
    );


  // GLOW FILTER
  var filter = g.append('defs')
        .append('filter')
        .attr('id','glow'),
      feGaussianBlur = filter.append('feGaussianBlur')
        .attr('stdDeviation','2.5')
        .attr('result','coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode')
      .attr('in','coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode')
      .attr('in','SourceGraphic');


  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid.selectAll(".levels")
    .data(d3.range(1,(cfg.levels+1)).reverse())
    .enter()
  .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d, i){return radius/cfg.levels*d;})
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1,(cfg.levels+1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function(d){return -d*radius/cfg.levels;})
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function(d,i) {
        return Format(maxValue * d/cfg.levels);
      });

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  //Append the lines
  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function(d, i){
      return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2);
     })
     .attr("y2", function(d, i){
       return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2);
     })
     .attr("class", "line")
     .style("stroke", "white")
     .style("stroke-width", "2px");

    //Append the labels at each axis
  axis.append("text")
    .attr("class", "radarLegend")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function(d, i){
      return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2);
    })
    .attr("y", function(d, i){
      return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2);
    })
    .text(function(d){return d})
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  var radarLine = d3.radialLine()
    .radius(function(d,i) {
      return rScale(d.value);
    })
    .angle(function(d,i) {
      return i*angleSlice;
    })
    .curve(d3.curveLinearClosed);


  //Create a wrapper for the blobs
  var blobWrapper = g.selectAll(".radarWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarWrapper");


  //Append the backgrounds
  blobWrapper.append("path")
    .attr("class", "radarArea")
    .attr("d", function(d,i) {
      return radarLine(d.data);
    })
    .style("fill", function(d,i) {
      return 'none';
      return 'purple';
    })
    .style("fill-opacity", cfg.opacityArea);

    /*
    .on('mouseover', function (d,i){
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", 0.1);

      //Bring back the hovered over blob
      d3.select(this)
        .transition().duration(200)
        .style("fill-opacity", 0.7);
    })
    .on('mouseout', function(){
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });
    */

  //Create the outlines
  blobWrapper.append("path")
    //.attr("class", "radarStroke")
    .attr('class', function(d){
      return 'radarStroke ' + d.state.replace(/\s+/g, '');
    })
    .attr("d", function(d,i) {
      return radarLine(d.data);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function(d,i) {
      return getStroke();
      //return cfg.stroke;
      //return cfg.color(i);
    })
    .style("fill", "none")
    .style("filter" , "url(#glow)");

  //Append the circles
  blobWrapper.selectAll(".radarCircle")
    .data(function(d,i) { return d; })
    .enter().append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function(d,i){
      console.log(i);
      return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
    })
    .attr("cy", function(d,i){
      return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2);
    })
    .style("fill", function(d,i,j) {
      return cfg.color(j);
    })
    .style("fill-opacity", 0.8);



  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////
  /*

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarCircleWrapper");


  //Append a set of invisible circles on top for the selected state
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
    .data(function(d,i) { return d; })
    .enter().append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr('class', function(d,i){return d.state;})
    .attr("r", cfg.dotRadius*1.5)
    .attr("cx", function(d,i){
      return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
    })
    .attr("cy", function(d,i){
      return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function(d,i) {
      newX =  parseFloat(d3.select(this).attr('cx')) - 10;
      newY =  parseFloat(d3.select(this).attr('cy')) - 10;

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(Format(d.value))
      .transition().duration(200)
  .style('opacity', 1);
  })
  .on("mouseout", function(){
  tooltip.transition().duration(200)
  .style("opacity", 0);
  });

  //Set up the small tooltip for when you hover over a circle
  var tooltip = g.append("text")
    .attr("class", "tooltip")
    .style("opacity", 0);
  */

    var selID = $('#selectStateRC').children('option:selected').attr('class');
    var p = d3.select('.radarStroke.' + selID);
    p.select(function(){return this.parentNode;}).raise();
    p.style('stroke', getHighlight());

    d3.select('#background')
      .on('change', function(){
        var svg = d3.select(id)
          .selectAll('.radarWrapper')
          .selectAll('path')
          .style('stroke', getStroke());

        var selID = $('#selectStateRC').children('option:selected').attr('class');
        var p = d3.select('.radarStroke.' + selID);
        p.select(function(){return this.parentNode;}).raise();
        p.style('stroke', getHighlight());

      });

    d3.select('#highlight')
      .on('change', function(){
        var selID = $('#selectStateRC').children('option:selected').attr('class');
        var p = d3.select('.radarStroke.' + selID);
        p.select(function(){return this.parentNode;}).raise();
        p.style('stroke', getHighlight());
      });

    d3.select('#selectStateRC')
      .on('change', function(){

        d3.selectAll('.radarStroke')
          .style('stroke', getStroke());

        var selID = $('#selectStateRC').children('option:selected').attr('class');
        var p = d3.select('.radarStroke.' + selID);
        p.select(function(){return this.parentNode;}).raise();
        p.style('stroke', getHighlight());

      })

} // radarChart




//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrap(text, width) {
  text.each(function() {
  var text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.4, // ems
    y = text.attr("y"),
    x = text.attr("x"),
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

  while (word = words.pop()) {
    line.push(word);
    tspan.text(line.join(" "));
    if (tspan.node().getComputedTextLength() > width) {
    line.pop();
    tspan.text(line.join(" "));
    line = [word];
    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
    }
  }
  });
}//wrap
