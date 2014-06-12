(function() {
  var container = d3.select('#main-chart');

  var currentData;

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

  // ticks
  var numberOfTicks = {
    x: 7,
    y: 4
  };

  var duration = 750;

  // setup date parsing
  var parseDate = d3.time.format("%d-%m-%Y").parse;

  // set Global vars
  var outerWidth, outerHeight, width, height, x, y,
    xAxis, yAxis, grid;

  /**
   * helper functions
   */
  function make_x_axis() {
    var axis = d3.svg.axis()
              .scale(x)
              .orient('top')
              .ticks(numberOfTicks.x);

    return axis;
  }

  function make_y_axis() {
    var axis = d3.svg.axis()
              .scale(y)
              .orient('left')
              .ticks(numberOfTicks.y);

    return axis;
  }

  function update_ticks() {
    var ticks = d3.selectAll('.grid g.tick line, .axis path, .axis g.tick line')
      .style("stroke-dasharray", ("2, 2"));

    return ticks;
  }

  function parse_data(data) {
    var parseData = data.forEach(function(d) {
      d.date = d.date instanceof Date ?  d.date : parseDate(d.date);
      d.value = +d.value;
    });

    return parseData;
  }


  function setupDimensions() {
    // size
    outerWidth = parseInt(container.style('width'));
    outerHeight = parseInt(container.style('height'));

    width = outerWidth - margin.left - margin.right;
    height = outerHeight - margin.top - margin.bottom;

    // scales
    x = d3.time.scale().range([0, width]);
    y = d3.scale.linear().range([height, 0]);

    // X axis
    xAxis = make_x_axis()
          .tickSize(0,0,0);

    // Y axis
    yAxis = make_y_axis()
           .tickSize(10,0,0);

    grid = make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat('');
  };

  var svg, area, valueline;

  function setupChart() {
    // SVG – main element
    svg = container
      .append('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // area
    area = d3.svg.area()
      .x(function(d) {
        return x(d.date);
      })
      .y0(height)
      .y1(function(d) {
        return y(d.value);
      });

    // line
    valueline = d3.svg.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.value);
      });

    // draw area
    svg.append('path')
      .attr('class', 'area');

    // add line
    //svg.append('path')
      //.attr('class', 'value-line');

    // add points group
    svg.append('g')
      .attr('class', 'points');

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

    update_ticks();
  }

  /**
   * Update data
   */

  function updateData(data) {

    parse_data(data);

    // Scale range of data
    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    y.domain([0, d3.max(data, function(d) {
      return d.value;
    })*1.1]); // add extra 10% space on top

    // points
    var point = svg.select('.points').selectAll('.point').data(data, function(d) {
      return d.date;
    });

    // enter
    point.enter()
      .append('g')
        .attr('class', 'point')
        .append('circle')
          .attr('r', 0)
          .attr('cx', function(d) {
            return x(d.date);
          })
          .attr('cy', function(d) {
            return y(d.value);
          })
          .attr('r', 4);

    // transition
    point.transition()
      .duration(duration)
        .select('circle')
          .attr('cx', function(d) {
            return x(d.date);
          })
          .attr('cy', function(d) {
            return y(d.value);
          });

    // exit
    point.exit().transition().duration(duration)
      .remove()
      .select('circle')
        .attr('r', 0);

    // update area
    svg.select('.area').transition()
      .duration(duration)
      .attr('d', area(data));

    // update value line
    //svg.select('.value-line').transition()
      //.duration(duration)
      //.attr('d', valueline(data));

    // update axis
    svg.select('.axis-x').transition()
      .duration(duration)
      .call(xAxis);

    svg.select('.axis-y').transition()
      .duration(duration)
      .call(yAxis);

    // update Grid
    svg.selectAll('.grid').transition()
      .duration(duration)
      .call(grid);

    update_ticks();
  }


  var btn2 = document.getElementById('revertBtn');
  btn2.onclick = revert;


  // update data
  function revert() {
    d3.json('../data/fixtures.json', function(error, data) {
      currentData = data;

      updateData(data);
    });
  }

  // Change data logic

  var btn = document.getElementById('updateBtn');
  btn.onclick = update;

  function update() {
    d3.json('../data/fixtures-alt.json', function(error, data) {
      currentData = data;

      updateData(data);
    });
  }

  // responsive
  $(window).on('resize', function() {
    outerWidth = parseInt(container.style('width'));
    outerHeight = parseInt(container.style('height'));


    width = outerWidth - margin.left - margin.right;
    height = outerHeight - margin.top - margin.bottom;

    x = d3.time.scale().range([0, width]);
    y = d3.scale.linear().range([height, 0]);

    xAxis = make_x_axis()
          .tickSize(0,0,0);

    // Y axis
    yAxis = make_y_axis()
           .tickSize(10,0,0);

    grid = make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat('');

    svg = container
      .select('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight)

    updateData(currentData);
  });


  // init

  // setup
  setupDimensions();
  setupChart();
  revert();

})();
