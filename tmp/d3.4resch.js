// src/d3.4resch.js

/* global mainChart, miniChart */

// imports
/*jshint ignore:start */

var mainChart = function(element, data) {
  this.container = element;

  if (data) {
    this.currentData = data;
  }
};

// Plugin class namespace
mainChart.prototype = {
  init: function() {
    // margins
    this.margin = {
      top: 30,
      right: 20,
      bottom: 40,
      left: 75
    };

    // ticks
    this.numberOfTicks = {
      x: 7,
      y: 4
    };

    // duration of animations
    this.duration = 750;

    // date format parsing setup
    this.parseDate = d3.time.format("%d-%m-%Y").parse;

    // first setup
    this.setupDimensions();
    this.setupChart();

    this.redrawChart(this.currentData);

    // return instance
    return this;
  },
  /**
   * Make X axis
   * @return d3.svg.axis
   */
  make_x_axis: function() {
    var self = this;

    return d3.svg.axis()
      .scale(self.x)
      .orient('top')
      .ticks(self.numberOfTicks.x);
  },
  /**
   * Make Y axis
   * @return d3.svg.axis
   */
  make_y_axis: function() {
    var self = this;

    return d3.svg.axis()
      .scale(self.y)
      .orient('left')
      .ticks(self.numberOfTicks.y);
  },
  /**
   * Parse data
   * @param data [array of objects]
   * @return parsed data
   */
  parse_data: function(data) {
    var parseDate = this.parseDate;

    data.forEach(function(d) {
      d.date = d.date instanceof Date ? d.date : parseDate(d.date);
      d.value = +d.value;
    });

    // store to current data
    this.currentData = data;

    return data;
  },
  /**
   * @void Setup Dimensions
   * @desc Setup instance dimansion based properties
   */
  setupDimensions: function() {
    var self = this;

    // dimensions of whole svg
    this.outerWidth = parseInt(this.container.style('width'));
    this.outerHeight = parseInt(this.container.style('height'));


    // setup dimensions of chart
    this.width = this.outerWidth - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top - this.margin.bottom;

    // setup scales
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    // setup axis
    this.xAxis = this.make_x_axis().tickSize(0,0,0);
    this.yAxis = this.make_y_axis().tickSize(10,0,0);

    // setup grid
    this.grid = this.make_y_axis().tickSize(-self.width, 0, 0).tickFormat('');
  },
  /**
   * @void setup chart
   * @desc prepare svg
   */
  setupChart: function() {
    var self = this;

    // SVG – main element
    this.svg = this.container
      .append('svg')
      .attr('class', 'main-chart')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // area
    this.svg.append('path')
      .attr('class', 'area');

    // points group
    this.svg.append('g')
      .attr('class', 'points');

    // grid
    this.svg.append('g')
      .attr('class', 'grid')
      .call(self.grid);

    // X axis
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .call(self.xAxis);

    // Y axis
    this.svg.append('g')
      .attr('class', 'axis axis-y')
      .call(self.yAxis);
  },
  /**
   * @void redraw
   * @desc draw data to chart
   * @param origData [array of Obj] !optional
   */
  redrawChart: function(origData) {
    var self = this;
    var svg = this.svg;
    var duration = this.duration;

    // parse data
    var data = origData ? this.parse_data(origData) : this.currentData;

    this.svg
      .attr('width', this.outerWidth)
      .attr('height', this.outerHeight);

    // stop if ther is no data;
    if (!data) return false;

    // Scale range of data
    this.x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    this.y.domain([0, d3.max(data, function(d) {
      return d.value;
    })*1.1]); // add 10% extra vertical space

    // define point
    var point = svg.select('.points').selectAll('.point').data(data, function(d) {
      return d.date;
    });

    // define area
    var area = d3.svg.area()
      .x(function(d) {
        return self.x(d.date);
      })
      .y0(self.height)
      .y1(function(d) {
        return self.y(d.value);
      });

    // point enter
    point.enter()
      .append('g')
        .attr('class', 'point')
        .append('circle')
          .attr('cx', function(d) {
            return self.x(d.date);
          })
          .attr('cy', function(d) {
            return self.y(d.value);
          })
          .attr('r', 4);

    // point transition
    point.transition()
      .duration(duration)
        .select('circle')
          .attr('cx', function(d) {
            return self.x(d.date);
          })
          .attr('cy', function(d) {
            return self.y(d.value);
          });

    // kill point
    point.exit().transition()
      .duration(duration)
      .remove()
      .select('circle')
        .attr('r', 0);

    // redraw area
    svg.select('.area').transition()
      .duration(duration)
      .attr('d', area(data));

    // update axis
    svg.select('.axis-x').transition()
      .duration(duration)
      .call(self.xAxis);

    svg.select('.axis-y').transition()
      .duration(duration)
      .call(self.yAxis);

    // update Grid
    svg.select('.grid').transition()
      .duration(duration)
      .call(self.grid);
  },
  /**
   * @void resize
   * @desc For renponsive
   * @param data [array of obj] !optional
   */
  resize: function(data) {
    this.setupDimensions();
    this.redrawChart(data);
  }
};

var miniChart = function(element, data) {
  this.container = element;

  if (data) {
    this.currentData = data;
  }
};

miniChart.prototype = {
  init: function() {
    // margins
    this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    };

    // duration of animations
    this.duration = 750;

    // date format parsing setup
    this.parseDate = d3.time.format("%d-%m-%Y").parse;

    // first setup
    this.setupDimensions();
    this.setupChart();

    this.redrawChart(this.currentData);

    // return instance
    return this;
  },
  /**
   * Parse data
   * @param data [array of objects]
   * @return parsed data
   */
  parse_data: function(data) {
    var parseDate = this.parseDate;

    data.forEach(function(d) {
      d.date = d.date instanceof Date ? d.date : parseDate(d.date);
      d.value = +d.value;
    });

    // store to current data
    this.currentData = data;

    return data;
  },
  /**
   * @void Setup Dimensions
   * @desc Setup instance dimansion based properties
   */
  setupDimensions: function() {

    // dimensions of whole svg
    this.outerWidth = parseInt(this.container.style('width'));
    this.outerHeight = parseInt(this.container.style('height'));

    // setup dimensions of chart
    this.width = this.outerWidth - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top - this.margin.bottom;

    // setup scales
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);
  },
  /**
   * @void setup chart
   * @desc prepare svg
   */
  setupChart: function() {

    // SVG – main element
    this.svg = this.container
      .append('svg')
      .attr('class', 'mini-chart')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // area
    this.svg.append('path')
      .attr('class', 'area');

  },
  /**
   * @void redraw
   * @desc draw data to chart
   * @param origData [array of Obj] !optional
   */
  redrawChart: function(origData) {
    var self = this;
    var svg = this.svg;
    var duration = this.duration;

    // parse data
    var data = origData ? this.parse_data(origData) : this.currentData;

    // set SVG height and width
    this.svg
      .attr('width', this.outerWidth)
      .attr('height', this.outerHeight);

    // stop if ther is no data;
    if (!data) return false;

    // Scale range of data
    this.x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    this.y.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);


    // define area
    var area = d3.svg.area()
      .x(function(d) {
        return self.x(d.date);
      })
      .y0(self.height)
      .y1(function(d) {
        return self.y(d.value);
      });

    // redraw area
    svg.select('.area').transition()
      .duration(duration)
      .attr('d', area(data));
  },
  /**
   * @void resize
   * @desc For renponsive
   * @param data [array of obj] !optional
   */
  resize: function(data) {
    this.setupDimensions();
    this.redrawChart(data);
  }
};




/*jshint ignore:end */

// wrap selector logic
var _wrap = function(selector, data) {

  var element = d3.select(selector);

  // check if d3 is set
  if (!window.d3) {
    console.log('this plugin require d3.js');
    return false;
  }

  // check if element exists
  if (!element) {
    console.log('Element ' + selector + ' was not found.');
    return false;
  }

  // set container of instance
  this.element = element;

  // set current data or empty array
  this.currentData = data ? data : null;

  return this;
};

// set prototype
_wrap.prototype = {
  mainChart: function(data) {

    if (!data) {
      data = this.currentData;
    }

    var chart = new mainChart(this.element, data);

    return chart.init();
  },
  miniChart: function(data) {

    if (!data) {
      data = this.currentData;
    }

    var chart = new miniChart(this.element, data);

    return chart.init();
  }
};

// Global class namespace
window.d34ResCh = function(selector, data) {
  return new _wrap(selector, data);
};
