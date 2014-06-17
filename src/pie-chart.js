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

    this.outerRadius = 70;
    this.innerRadius = 50;

    // first setup
    this.setupDimensions();

    this.setupChart();

    return this;
  },
  /**
   * Parse data
   * @desc if data needs to be parsed
   * @param data [data - array of objects]
   */
  parse_data: function(data) {
    return data;
  },
  /**
   * Arc
   * @arg start [int] - radians
   * @arg end [int] - radians
   */
  arc: function(start, end) {
    var start = 45 * (Math.PI/180) * start
    return d3.svg.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
      .startAngle(start)
      .endAngle(end);
  },
  /**
   * Setup dimensions
   * @desc Setup charts dimensions
   */
  setupDimensions: function() {

    // dimensions of whole svg
    this.outerWidth = parseInt(this.container.style('width'));
    this.outerHeight = parseInt(this.container.style('height'));

    // setup dimensions of chart
    this.width = this.outerWidth - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top - this.margin.bottom;

    this.arc = d3.svg.arc()
      .outerRadius();

  },
  /**
   * Setup Chart
   * @desc generate chart's structure
   * @return instace of this
   */
  setupChart: function() {
    //var self = this;

    // define svg
    this.svg = this.container
      .append('svg')
      .attr('class', 'pie-chart')
      .append('g')
      .attr('transform', 'translate(' + this.outerWidth/2 + ',' + this.outerHeight/2 + ')');

    return this;
  },
  redrawChart: function(newData) {
    var self = this;
    var svg = this.svg;
    var duration = this.duration;

    // parse data
    var data = newData ? this.parse_data(data) : this.currentData;

    // stop if there is no data
    if (!data) return false;

    data.forEach(function(d) {
      self.svg.append('path').call(self.arc(1,d.value));
    });
  }
};
