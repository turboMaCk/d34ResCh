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

    this.resizeChart();

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

    return this;
  },
  /**
   * Setup Chart
   * @desc generate chart's structure
   * @return instace of this
   */
  setupChart: function() {

    var self = this;

    // define svg
    this.svg = this.container
      .append('svg')
      .attr('class', 'pie-chart');

    this.chart = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.outerWidth/2 + ',' + this.outerHeight/2 + ')');

    var legendTop = this.height + this.margin.bottom;

    this.legend = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + this.margin.left + ',' + legendTop + ')');

    this.color = d3.scale.ordinal()
      .range(["#3FB0CC", "#A1D8E6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    return this;
  },
  resizeChart: function() {
    this.svg
      .style('height', self.outerHeight)
      .style('width', self.outerWidth);

    this.chart
      .attr('transform', 'translate(' + this.outerWidth/2 + ',' + this.outerHeight/2 + ')');
  },
  redrawChart: function(newData) {
    var self = this;

    // parse data
    var data = newData ? this.parse_data(newData) : this.currentData;

    // setup pie parts
    var pie = d3.layout.pie()
      .value(function(d) {
        return d.value;
      });

    var arc = d3.svg.arc()
      .outerRadius(self.outerRadius)
      .innerRadius(self.innerRadius);

    var arcTween = function(a) {

      console.log('tween', this);

      var i = d3.interpolate(this._current, a);
      this._current = i(0);

      return function(t) {
        return arc(i(t));
      };
    };

    // stop if there is no data
    if (!data) return false;

    // draw legend
    this.drawLegend(data);

    // define arcs
    this.pie = this.chart.datum(data).selectAll('path')
      .data(pie)
      .sort(d3.descending);

    this.pie.enter().append('path')
      .attr('class', 'arc')
      .attr('d', arc)
      .style('fill', function(d) {
        return self.color(d.data.value);
      })
      .each(function(d) {
        this._current = d;
      });

    this.pie.transition()
      .attrTween('d', arcTween);

    this.pie.exit()
      .transition().duration(this.duration)
      .remove();
  },
  drawLegend: function(data) {
    var self = this;

    var items = this.legend.selectAll('.item')
      .data(data);

    var offest;

    var item = items.enter().append('g')
      .attr('class', '.item')
      .attr('transform', function(d, i) {
        offset = 150*i;

        return 'translate(' + offset + ', 0)';
      });

    item.append('circle')
      .attr('r', 4)
      .style('fill', function(d) {
        return self.color(d.value);
      });

    item.append('text')
      .attr('transform', 'translate(10, 4)')
      .text(function(d) {
        return d.name;
      });

    items.exit().remove();
  },
  resize: function() {
    this.setupDimensions();
    this.resizeChart();
  }
};
