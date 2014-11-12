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
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
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
