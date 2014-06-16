// src/d3.4resch.js

/* global mainChart, miniChart */

// imports
/*jshint ignore:start */

include "main-chart.js"
include "mini-chart.js"
include "progress-chart.js"

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
