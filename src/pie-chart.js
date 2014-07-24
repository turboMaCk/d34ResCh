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
