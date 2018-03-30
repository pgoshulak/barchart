function createTitle (titleText) {
  return $('<h4></h4>').text(titleText);
}

function createChartArea (data, options) {
  // Create grid container
  var chartArea = $('<div></div>').addClass('grid-container');
  var gridTemplateColumns = '';
  data.forEach(function(entry) {
    gridTemplateColumns += 'auto ';

    var column = $('<div></div>').addClass('grid-item').text(entry.label);
    chartArea.append(column);
  });
  chartArea.css('grid-template-columns', gridTemplateColumns);
  return chartArea;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  $('#' + element).append(titleElem, chartElem);
}