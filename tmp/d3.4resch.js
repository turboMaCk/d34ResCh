// src/d3.4resch.js

/* global mainChart, miniChart, progressTable, pieChart */

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
      right: 40,
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
      .attr('class', 'main-chart');

    this.mainGroup = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // area
    this.mainGroup.append('path')
      .attr('class', 'area');

    // points group
    this.mainGroup.append('g')
      .attr('class', 'points');

    // grid
    this.mainGroup.append('g')
      .attr('class', 'grid')
      .call(self.grid);

    // X axis
    this.mainGroup.append('g')
      .attr('class', 'axis axis-x')
      .call(self.xAxis);

    // Y axis
    this.mainGroup.append('g')
      .attr('class', 'axis axis-y')
      .call(self.yAxis);
  },
  /**
   * @void redraw
   * @desc draw data to chart
   * @param newdata [array of Obj] !optional
   */
  redrawChart: function(newData) {
    var self = this;
    var svg = this.svg;
    var duration = this.duration;

    // parse data
    var data = newData ? this.parse_data(newData) : this.currentData;

    // set SVG height and width
    this.svg
      .attr('width', this.outerWidth)
      .attr('height', this.outerHeight);

    // stop if there is no data;
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
      .attr('class', 'mini-chart');

    this.mainGroup = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // area
    this.mainGroup.append('path')
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

var progressTable = function(element, data) {

  this.container = element;

  if (data) {
    this.currentData = data;
  }
};

progressTable.prototype = {
  init: function () {

    this.duration = 750;

    this.parse_data(this.currentData);

    this.updateData();

    return this;
  },
  /**
   * Parse data
   * @param data [array of objects]
   * @return parsed data
   */
  parse_data: function(data) {
    var self = this;

    // escape if there are no data
    if (!data) {
      return false;
    }

    this.valuesSuma = 0;

    data.forEach(function(d) {
      self.valuesSuma += parseInt(d.value);
    });

    data.forEach(function(d) {
      d.name = d.name;
      d.value = +d.value;
      d.percents = d.value / self.valuesSuma * 100;
    });

    this.currentData = data;

    return data;
  },
  /**
   * Append row
   * @desc add row to table
   */
  appendRow: function(data) {
    var tr = this.container.append('tr');

    var name = tr.append('td')
        .attr('class', 'name');

    name.append('i')
        .attr('class', 'ico ico-document');

    name.text(data.name);

    tr.append('td')
      .attr('class', 'progress')
        .append('span')
          .attr('class', 'progress-container')
          .append('span')
            .attr('class', 'progress-bar')
            .style('width', data.percents + '%');

    tr.append('td')
      .attr('class', 'value')
      .text(data.value);

    tr.append('td')
      .attr('class', 'percents')
      .text(Math.round(data.percents)+ '%');
  },
  /**
   * Update data
   * @desc render table
   */
  updateData: function(data) {
    var self = this;

    if (!data) {
      data = this.currentData;
    }

    // escape if there is no data
    if (!data) {
      return false;
    }

    this.currentData.map(self.appendRow, this);
  },
  /**
   * Clean table
   * @desc clean all table rows
   */
  cleanTable: function() {
    this.container.selectAll('tr').remove();
  }
};

var pieChart = function(element, data) {
  this.container = element;

  if (data) {
    this.currentData = data;
  }
};

pieChart.prototype = {
  init: function() {

    // margins
    this.margin = {
      top: 30,
      right: 20,
      bottom: 75,
      left: 20,
    };

    // duration of animations
    this.duration = 750;

    this.thickness = 15;

    // first setup
    this.setupDimensions();

    this.setupChart();

    this.redrawChart(this.currentData);

    return this;
  },
  /**
   * Parse data
   * @desc if data needs to be parsed
   * @param data [data - array of objects]
   */
  parse_data: function(data) {
    this.currentData = data;
    return data;
  },
  /**
   * Setup dimensions
   * @desc Setup charts dimensions
   */
  setupDimensions: function() {
    var self = this;

    // dimensions of whole svg
    this.outerWidth = parseInt(this.container.style('width'));
    this.outerHeight = parseInt(this.container.style('height'));

    // setup dimensions of chart
    this.width = this.outerWidth - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;

    this.outerRadius = Math.min(self.width, self.height) / 2;
    this.innerRadius = self.outerRadius - this.thickness;

    // setup pie parts
    this.arc = d3.svg.arc()
      .outerRadius(self.outerRadius)
      .innerRadius(self.innerRadius);

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    return this;
  },
  /**
   * Setup Chart
   * @desc generate chart's structure
   * @return instace of this
   */
  setupChart: function() {

    // define svg
    this.svg = this.container
      .append('svg')
      .attr('class', 'pie-chart');

    this.chart = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.outerWidth/2 + ',' + this.outerHeight/2 + ')');

    this.legend = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + this.outerHeight / 2 + ',' + this.height + ')');

    return this;
  },
  redrawChart: function(newData) {
    var self = this;
    var svg = this.svg;

    this.color = d3.scale.ordinal()
      .range(["#3FB0CC", "#A1D8E6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    svg
      .style('height', self.outerHeight)
      .style('width', self.outerWidth);

    // parse data
    var data = newData ? this.parse_data(newData) : this.currentData;

    // stop if there is no data
    if (!data) return false;

    this.drawLegend(data);

    // define arcs
    var arcs = this.chart.selectAll('.arc')
      .data(self.pie(data))
      .each(function(d) { this._current = d; });

    // enter
    arcs.enter().append('g')
      .attr('class', 'arc');

    arcs.transition().duration(750);

    arcs.append('path')
      .attr('d', self.arc)
      .style('fill', function(d) {
        return self.color(d.data.value);
      });
  },
  drawLegend: function(data) {
    var self = this;

    var items = this.legend.selectAll('.item')
      .data(data);

    items.enter().append('g')
      .attr('class', '.item')
      .append('circle')
      .attr('r', 4)
      .style('fill', function(d) {
        console.log(d);
        return self.color(d.value);
      });
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
  },
  progressTable: function(data) {

    if (!data) {
      data = this.currentData;
    }

    var chart = new progressTable(this.element, data);

    return chart.init();
  },
  pieChart: function(data) {

    if (!data) {
      data = this.currentData;
    }

    var chart = new pieChart(this.element, data);

    return chart.init();
  }
};

// Global class namespace
window.d34ResCh = function(selector, data) {
  return new _wrap(selector, data);
};
