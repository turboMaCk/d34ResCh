// scripts/main.js

/* global d34ResCh */

(function() {
  d3.json('../data/fixtures.json', function(error, data) {

    // init with data
    chart = d34ResCh('#main-chart').mainChart(data, {
      click: function(d, i, el) {
        console.log(d, i, el);
      }
    });
  });

  // init
  var chart2 = d34ResCh('#main-chart2').miniChart();

  d3.json('../data/fixtures-alt.json', function(error, data) {

    // and then load data display them...
    chart2.redrawChart(data);

    // and then wait for 2s
    window.setTimeout(afterTimeout, 2000);
  });

  // and then swith data between charts
  var afterTimeout = function() {
    var a = chart.currentData;
    var b = chart2.currentData;

    chart.redrawChart(b);
    chart2.redrawChart(a);
  };

  var table;

  d3.json('../data/progress-table.json', function(error, data) {
    table = d34ResCh('#progress-table').progressTable(data);
  });


  this.setTimeout(function() {
    d3.json('../data/progress-table2.json', function(error, data) {
      table.redrawChart(data)
    });
  }, 3000);

  var pie = d34ResCh('.pie-chart').pieChart();

  d3.json('../data/pie-chart.json', function(error, data) {

    pie.redrawChart(data);
  });

  this.setTimeout(function() {
    d3.json('../data/pie2.json', function(error, data) {
      pie.redrawChart(data);
    });
  }, 4000);

  // use dimension event
  function windowResize() {
    chart2.resize();
    chart.resize();
    pie.resize();
  }

  window.onresize = windowResize;
})();
