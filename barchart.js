function createTitle (titleText) {
  return $('<h4></h4>').text(titleText);
}

function getMaxDataVal (data) {
  var maxVal = data[0].value;
  data.forEach(function(entry) {
    if (entry.value > maxVal) {
      maxVal = entry.value;
    }
  });
  return maxVal;
}

/** Function to draw the chart area
 *
 */
function createChartArea (data, options) {
  // Create grid container
  var chartArea = $('<div></div>').addClass('grid-container');
  // Create string for CSS-grid property 'grid-template-columns: auto auto auto...'
  var gridTemplateColumns = '';
  var maxVal = getMaxDataVal(data);

  // Add each data entry
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    // Add a column to the CSS-grid property string
    gridTemplateColumns += 'auto ';

    // Construct the column
    var column = $('<div></div>')
      .addClass('grid-item')
      .css('gridRowEnd', (maxVal + 1).toString())
      .css('gridRowStart', (maxVal + 1 - entry.value).toString())
      ;

    chartArea.append(column);
  }

  chartArea.css('grid-template-columns', gridTemplateColumns);
  return chartArea;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  $('#' + element).append(titleElem, chartElem);
}