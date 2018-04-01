var GRID_ROW_BOTTOM = 101.0;

function createTitle (titleText) {
  return $('<h4></h4>').text(titleText).addClass('grid-title');
}

/** Find the maximum value to be displayed */
function getMaxDataVal (data) {
  var maxDataVal = 0;
  data.forEach(function(entry) {
    // Check single-bar columns
    if (entry.value > maxDataVal) {
      maxDataVal = entry.value;

    } else if (entry.multiValues) {
      // Check multi-bar columns
      totalColumnVal = 0;
      entry.multiValues.forEach(function(singleEntry) {
        totalColumnVal += singleEntry.value;
      });
      if (totalColumnVal > maxDataVal) {
        maxDataVal = totalColumnVal;
      }
    }
  });
  return maxDataVal;
}

/** Find the maximum chart y-axis value (ensure data fits on chart) */
function getMaxChartVal (maxDataVal, gridlineSpacingY) {
  return (Math.floor(maxDataVal / gridlineSpacingY) + 1) * gridlineSpacingY;
}

/** Find conversion factor for data -> CSS grid rows */
function getDataScaleFactor (maxChartVal) {
  // Scale data to fit to 100 rows
  return 100.0 / maxChartVal;
}

/** Create a single bar of data
 *
 */
function createSingleDataBar (dataEntry, gridPoints) {
  var dataBar = $('<div></div>')
  .addClass('grid-data')
  // .css('gridRowStart', Math.floor(startPoint.gridRow - (entry.value * dataScaleFactor)).toString())
  // .css('gridRowEnd', (startPoint.gridRow).toString())
  // .css('gridColumn', startPoint.gridColumn + '/' + (startPoint.gridColumn + 1))
  .css('gridRowStart', gridPoints.rowTop.toString())
  .css('gridRowEnd', gridPoints.rowBottom.toString())
  .css('gridColumn', gridPoints.column + '/' + (gridPoints.column + 1))
  ;
  if (dataEntry.color) {
    dataBar.css('backgroundColor', dataEntry.color);
  }
  return dataBar;
}

/** Create the data column
 *
 */
function createDataColumn (entry, gridColumn, dataScaleFactor) {
  // Initialize points on CSS-grid to draw bar
  var gridPoints = {
    column: gridColumn,
    rowBottom: GRID_ROW_BOTTOM,
    rowTop: null
  };
  var valueTop = 0;
  var valueBottom = 0;

  // If this is a single-bar data entry
  if (entry.value) {
    // Calculate top row in CSS-grid (ie. value of data)
    gridPoints.rowTop = Math.round(GRID_ROW_BOTTOM - entry.value * dataScaleFactor);
    return createSingleDataBar(entry, gridPoints);
    
  } else if (entry.multiValues) {
    // Else: this is a multi-bar data entry
    var allDataBars = [];
    for (var i = 0; i < entry.multiValues.length; i++) {
      singleEntry = entry.multiValues[i];
      valueBottom = valueTop;
      valueTop += singleEntry.value;
      // Calculate rows in CSS-grid (takes into account previous data points)
      gridPoints.rowTop = Math.round(GRID_ROW_BOTTOM - valueTop * dataScaleFactor);
      gridPoints.rowBottom = Math.round(GRID_ROW_BOTTOM - valueBottom * dataScaleFactor);
      // Generate the data bar and add it to the list
      allDataBars.push(createSingleDataBar(singleEntry, gridPoints));
      // Assign the bottom of next bar as the top of the current bar (to stack)
    }
    return allDataBars;
  }
}

/** Create x-axis data label
 *
 */
function createLabelX (entry, gridColumnNum) {
  var label = $('<div></div>')
    .addClass('grid-label-x')
    .text(entry.columnLabel)
    .css('gridRowStart', (GRID_ROW_BOTTOM).toString())
    .css('gridRowEnd', (GRID_ROW_BOTTOM + 1).toString())
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
    var row = Math.round(GRID_ROW_BOTTOM - (i * spacing * scale));
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
    .css('grid-template-columns', 'auto repeat(' + data.length + ', 1fr) 0')
    ;
  // Create string for CSS-grid property 'grid-template-columns: auto auto auto...'
  var maxDataVal = getMaxDataVal(data);
  var maxChartVal = getMaxChartVal(maxDataVal, options.gridlineSpacingY);
  var dataScaleFactor = getDataScaleFactor(maxChartVal);

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