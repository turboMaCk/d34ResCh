(function() {
  var chart = $("svg"),
    aspect = chart.width() / chart.height(),
    container = chart.parent();

  $(window).on("resize", function() {
      var targetWidth = container.width();
      chart.attr("width", targetWidth);
      chart.attr("height", Math.round(targetWidth / aspect));
  }).trigger("resize");
})();
