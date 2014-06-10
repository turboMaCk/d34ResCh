(function() {

  /**
   * Load other data
   */

  var updateBtn = document.getElementById('updateBtn');

  updateBtn.onclick = updateData;

  function updateData() {
    d3.json('../data/fixtures-alt.json', function(error, data) {

      console.log(data);

      // parse data
      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.value;
      });

      // Scale range od data
      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));

      y.domain([0, d3.max(data, function(d) {
        return d.value;
      })]);


      // aply changes
      var svg = d3.select('body').transition();

      // make changes
      svg.select('.area')
        .duration(750)
        .attr('d', area(data));

      svg.select('.axis-x')
        .duration(750)
        .call(xAxis);

      svg.select('.axis-y')
        .duration(750)
        .call(yAxis);

      svg.selectAll('.grid')
        .duration(750)
        .call(grid);

      updateTicks();
    });
  }

  /**
   * BASIC CONFIG
   */

  // margins
  var margin = {
    top: 30,
    right: 20,
    bottom: 40,
    left: 75
  };

  // size
  var outerWidth = 900;
  var outerHeight = 270;

  // others
  var numberOfTicks = {
    x: 7,
    y: 4
  };

  var width = outerWidth - margin.left - margin.right;
  var height = outerHeight - margin.top - margin.bottom;

  // setup date parsing
  var parseDate = d3.time.format("%d-%m-%Y").parse;

  // scales
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);


  // area
  var area = d3.svg.area()
                    .x(function(d) {
                      return x(d.date);
                    })
                    .y0(height)
                    .y1(function(d) {
                      return y(d.value);
                    });

  // main element
  var svg = d3.select('body')
              .append('svg')
              .attr('width', outerWidth)
              .attr('height', outerHeight)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // X axis
  var xAxis = make_x_axis()
        .tickSize(0,0,0);

  // Y axis
  var yAxis = make_y_axis()
         .tickSize(10,0,0);

  var grid = make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat('');

  var updateTicks = function() {
    d3.selectAll('.grid g.tick line, .axis path, .axis g.tick line')
      .style("stroke-dasharray", ("2, 2"));
  }

  /**
   * Functions
   */
  function make_x_axis() {
    return d3.svg.axis()
              .scale(x)
              .orient('top')
              .ticks(numberOfTicks.x);
  }

  function make_y_axis() {
    return d3.svg.axis()
              .scale(y)
              .orient('left')
              .ticks(numberOfTicks.y);
  }

  /**
   * Parse data
   */

  d3.json("../data/fixtures.json", function(error, data) {

    // parse Date
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

    // set domains
    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    y.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    // draw area
    svg.append('path')
      .datum(data)
      .attr('class', 'area')
      .attr('d', area);

    // Draw grid
    svg.append('g')
      .attr('class', 'grid')
      .call(grid);

    // draw X axis
    svg.append('g')
      .attr('class', 'axis axis-x')
      .call(xAxis);

    // draw Y axis
    svg.append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    // Label axis

    // Label X
    svg.append('text')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height + margin.bottom) + ')')
      .style('text-anchor', 'middle')
      .text('Date');

    // Label Y
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Visits');


    // restyle grid
    updateTicks()
  });

})();
