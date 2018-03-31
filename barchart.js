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
/** Create the data column
 *
 */
function createDataColumn (entry, dataScaleFactor) {
  var column = $('<div></div>')
    .addClass('grid-data')
    .css('gridRowStart', (101 - (entry.value * dataScaleFactor)).toString())
    .css('gridRowEnd', (101).toString())
    ;
  return column;
}

/** Create x-axis data label
 *
 */
function createLabelX (entry) {
  var label = $('<div></div>')
    .addClass('grid-label-x')
    .text(entry.label)
    .css('gridRowStart', (101).toString())
    .css('gridRowEnd', (102).toString())
    ;
  return label;
}

/** Create y-axis grid line
 *
 */
function createGridlinesY (spacing, scale) {
  var numLines = Math.floor(100.0 / (spacing * scale));
  var gridlines = [];
  
  for (var i = 1; i <= numLines; i++) {
    // Convert data value to CSS-grid row
    var row = 101 - (i * spacing * scale);
    var gridline = $('<div></div>')
      .addClass('grid-line')
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '1 / -1')
      ;
    gridlines.push(gridline);
  }
  return gridlines;
}

/** Draw the chart area
 *
 */
function createChartArea (data, options) {
  // Create grid container
  var chartArea = $('<div></div>')
    .addClass('grid-container')
    .css('grid-template-columns', 'repeat(' + data.length + ', 1fr)')
    ;
  // Create string for CSS-grid property 'grid-template-columns: auto auto auto...'
  var maxVal = getMaxDataVal(data);
  var dataScaleFactor = getDataScaleFactor(maxVal);

  // Add each data entry
  data.forEach(function(entry) {
    // Construct the column and label
    column = createDataColumn(entry, dataScaleFactor);
    label = createLabelX(entry);

    chartArea.append(column, label);
  });
  
  // Write the grid lines;
  var gridlines = createGridlinesY(options.gridlineSpacingY, dataScaleFactor);
  chartArea.append(gridlines);

  return chartArea;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  $('#' + element).append(titleElem, chartElem);
}