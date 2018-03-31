function createTitle (titleText) {
  return $('<h4></h4>').text(titleText).addClass('grid-title');
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
function createDataColumn (entry, gridColumnNum, dataScaleFactor) {
  var column = $('<div></div>')
    .addClass('grid-data')
    .css('gridRowStart', (101 - (entry.value * dataScaleFactor)).toString())
    .css('gridRowEnd', (101).toString())
    .css('gridColumn', gridColumnNum + '/' + (gridColumnNum + 1))
    ;
  if (entry.color) {
    column.css('backgroundColor', entry.color);
  }
  return column;
}

/** Create x-axis data label
 *
 */
function createLabelX (entry, gridColumnNum) {
  var label = $('<div></div>')
    .addClass('grid-label-x')
    .text(entry.label)
    .css('gridRowStart', (101).toString())
    .css('gridRowEnd', (102).toString())
    .css('gridColumn', gridColumnNum + '/' + (gridColumnNum + 1))
    ;
  return label;
}

/** Create y-axis grid lines and labels
 *
 */
function createGridlinesAndLabelsY (spacing, scale) {
  var numLines = Math.floor(100.0 / (spacing * scale));
  var gridlines = [];
  
  for (var i = 0; i <= numLines; i++) {
    // Convert data value to CSS-grid row
    var row = 101 - (i * spacing * scale);
    var gridline = $('<div></div>')
      .addClass('grid-line')
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '1 / -1')
      ;
    gridlines.push(gridline);

    var dataLabelY = $('<div></div>')
      .addClass('grid-label-y')
      .text(i * spacing)
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '1 / 2')
      ;
    gridlines.push(dataLabelY);
  }
  return gridlines;
}

/** Create y-axis
 *
 */
function createAxisY () {
  var axisY = $('<div></div>')
    .addClass('grid-axis-y')
    .css('gridRow', '1 / -2')
    .css('gridColumn', '1 / 2')
    ;

  return axisY;
}

/** Draw the chart area
 *
 */
function createChartArea (data, options) {
  // Create grid container
  var chartArea = $('<div></div>')
    .addClass('grid-chart-area')
    .css('grid-template-columns', 'auto repeat(' + data.length + ', 1fr)')
    ;
  // Create string for CSS-grid property 'grid-template-columns: auto auto auto...'
  var maxVal = getMaxDataVal(data);
  var dataScaleFactor = getDataScaleFactor(maxVal);

  // Add y-axis
  var axisY = createAxisY();
  chartArea.append(axisY);

  // Add each data entry
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    var gridColumnNum = i + 2;
    // Construct the column and label
    column = createDataColumn(entry, gridColumnNum, dataScaleFactor);
    label = createLabelX(entry, gridColumnNum);

    chartArea.append(column, label);
  }
  
  // Write the grid lines;
  var gridlines = createGridlinesAndLabelsY(options.gridlineSpacingY, dataScaleFactor);
  chartArea.append(gridlines);

  return chartArea;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  if (options.titlePosition === 'top') {
    $('#' + element).append(titleElem, chartElem);
  } else {
    $('#' + element).append(chartElem, titleElem);
  }
}