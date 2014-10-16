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
   * Redraw Chart
   * @desc redrow existing table to display new data-set
   */
  redrawChart: function(data) {
    this.parse_data(data);
    this.updateData();
  },
  /**
   * Update data
   * @desc render table
   */
  updateData: function() {
    var self = this;
    data = this.currentData;

    // escape if there is no data
    if (!data) {
      return false;
    }

    this.cleanTable();
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
