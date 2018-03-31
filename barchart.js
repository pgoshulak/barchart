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

function getDataScaleFactor (maxDataVal) {
  // Scale data to fit to 100 rows
  return 100.0 / maxDataVal;
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
  var dataScaleFactor = getDataScaleFactor(maxVal);

  // Add each data entry
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    // Add a column to the CSS-grid property string
    gridTemplateColumns += 'auto ';

    // Construct the column
    var column = $('<div></div>')
      .addClass('grid-data')
      .css('gridRowStart', (101 - (entry.value * dataScaleFactor)).toString())
      .css('gridRowEnd', (101).toString())
      ;

    var label = $('<div></div>')
      .addClass('grid-label-x')
      .text(entry.label)
      .css('gridRowStart', (101).toString())
      .css('gridRowEnd', (102).toString())
      ;

    chartArea.append(column, label);
  }

  chartArea.css('grid-template-columns', gridTemplateColumns);
  return chartArea;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  $('#' + element).append(titleElem, chartElem);
}